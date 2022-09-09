import {
  T_Sale,
  T_SaleLookupTable,
  T_Token,
} from '../types/graphQL_entities_def'
import { delay } from '../utils/util_functions'
import { ProjectData } from './subgraph_repository'
import axios, { AxiosResponse } from 'axios'

require('dotenv').config()

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY
const MAX_RETRIES = 100
const SALES_BATCH_SIZE = 500
const RESERVOIR_TIMEOUT = 5000

type ReservoirSaleEvent = {
  id: string
  saleId: string
  token: {
    contract: string
    tokenId: string
  }
  orderSource: string
  orderSide: string
  orderKind: string
  from: string
  to: string
  amount: number
  fillSource: string
  block: number
  txHash: string
  timestamp: number
  price: {
    currency: {
      contract: string
      symbol: string
    }
    amount: {
      raw: string // wei amount
      decimal: number
      usd: number
      native: number
    }
  }
}
type SalesResponse = {
  sales: ReservoirSaleEvent[]
  continuation: string | null
}

function reservoirSaleModelToSubgraphModel(
  projectInfo: ProjectData,
  reservoirSale: ReservoirSaleEvent
): T_Sale {
  const _saleType = reservoirSale.amount > 1 ? 'Bundle' : 'Single'
  // other part of codebase uses length of _summaryTokensSold split by ::
  // to divide up royalty payments on bundle sales, so use same encoding
  let _summaryTokensSold = 'dummy'

  // Convert token(s) to array of subgraph's T_SaleLookupTable model
  const _reservoirLookupTable: T_SaleLookupTable[] = []
  // populate this with same data as defined in sales_repository.ts
  if (_saleType === 'Single') {
    // single sale
    const _token: T_Token = {
      id: `${reservoirSale.token.contract}-${reservoirSale.token.tokenId}`,
      tokenId: parseInt(reservoirSale.token.tokenId),
      contract: {
        id: reservoirSale.token.contract,
      },
      project: {
        id: projectInfo.id,
        name: projectInfo.name ?? '',
        artistAddress: projectInfo.artistAddress,
        curationStatus: 'factory', //projectInfo.curationStatus ?? 'factory', // TODO: fix curation status
        additionalPayee: projectInfo.additionalPayee ?? null,
        additionalPayeePercentage: projectInfo.additionalPayeePercentage
          ? parseFloat(projectInfo.additionalPayeePercentage)
          : null,
      },
    }
    _reservoirLookupTable.push({
      id: `${projectInfo.id}::${_token.id}::${reservoirSale.id}`,
      token: _token,
    })
  } else {
    // bundle sale
    // TODO
  }

  // complete conversion to subgraph T_Sale model
  try {
    if (reservoirSale.price?.currency?.contract === null) {
      console.warn(
        "[WARN] Payment token is NULL from Reservoir's api. " +
          'This has been observed at least once, and assumption that payment ' +
          'token was ETH was valid. Assuming ETH is payment token, but ' +
          'recommend validating on etherscan.'
      )
      console.warn(
        `[WARN] The relavent tx for msg above is: ${reservoirSale.txHash}`
      )
      // assign payment token to ETH
      reservoirSale.price.currency.contract =
        '0x0000000000000000000000000000000000000000'
    }
    const _sale: T_Sale = {
      id: reservoirSale.id,
      exchange: 'OS_Vunknown', // TODO: Write correct exchange
      saleType: _saleType,
      blockNumber: reservoirSale.block,
      blockTimestamp: new Date(reservoirSale.timestamp).toUTCString(), // TODO confirm UTC is correct
      seller: reservoirSale.to,
      buyer: reservoirSale.from,
      paymentToken: reservoirSale.price.currency.contract,
      price: reservoirSale.price.amount.raw.toString(),
      isPrivate: false, // TODO: handle private sales
      summaryTokensSold: _summaryTokensSold,
      saleLookupTables: _reservoirLookupTable,
    }
    return _sale
  } catch (e) {
    console.error('[ERROR] Error in ReservoirSaleConverter')
    console.error(reservoirSale)
    console.error(reservoirSale.price.currency.contract)
    throw e
  }
}

export async function getReservoirSalesForContracts(
  contracts: string[],
  projectInfo: Record<string, ProjectData>,
  startTimestamp: number,
  endTimestamp: number
): Promise<T_Sale[]> {
  const reservoirSales: T_Sale[] = []
  let _continuation = ''
  let contractsString = '&contract=' + contracts.join('&contract=')

  // Ping the Reservoir API, paginating until we get to the end
  while (true) {
    let url = `https://api.reservoir.tools/sales/v4?${contractsString}&limit=${SALES_BATCH_SIZE}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`
    if (_continuation !== '') {
      url = url + `&continuation=${_continuation}`
    }
    let response: AxiosResponse<SalesResponse>
    try {
      response = await axios.get<SalesResponse>(url, {
        headers: {
          'x-api-key': RESERVOIR_API_KEY ?? '',
        },
        timeout: RESERVOIR_TIMEOUT,
      })
    } catch (e) {
      console.warn(e)
      delay(500)
      continue
    }

    let data = response.data
    // Add every sale to the array
    data.sales.forEach((sale) => {
      // Get the project info using the dictionart
      const projId = Math.floor(parseInt(sale.token.tokenId) / 1e6)
      const projectKey = `${sale.token.contract}-${projId}`
      reservoirSales.push(
        reservoirSaleModelToSubgraphModel(projectInfo[projectKey], sale)
      )
    })
    if (data.continuation == null) {
      // reached end of reservoir's pagination
      break
    }
    _continuation = data.continuation
  }

  // loop through all new sales to check if any before minBlockNumber if so, skip them
  const finalReservoirSales: T_Sale[] = []
  for (let i = 0; i < reservoirSales.length; i++) {
    // only include if new sale's block is >= minBlock
    if (Date.parse(reservoirSales[i].blockTimestamp) >= startTimestamp) {
      finalReservoirSales.push(reservoirSales[i])
    } else if (reservoirSales[i].blockNumber === null) {
      // have observed Reservoir API return this for failed transactions
      // sale did not occur (even though a successful event), so just skip
      console.debug(
        `[DEBUG] Skipped failed tx with null block number on collection ${reservoirSales[i].id}`
      )
    }
  }
  return finalReservoirSales
}
