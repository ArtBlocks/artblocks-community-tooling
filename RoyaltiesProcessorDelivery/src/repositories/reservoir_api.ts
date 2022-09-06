const sdk = require('api')('@opensea/v1.0#bg4ikl1mk428b')
import {
  T_Sale,
  T_TokenZero,
  T_SaleLookupTable,
  T_Token,
} from '../types/graphQL_entities_def'
import { delay } from '../utils/util_functions'
import { ProjectData } from './subgraph_repository'
import axios from 'axios'

require('dotenv').config()

const flatCache = require('flat-cache')

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
type ProjectCollectionResponse = {
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
  let _numTokensSold = 1
  if (_saleType == 'Bundle') {
    // intentionally begin loop at index 1 because already have 1 loaded
    for (let i = 1; i < _event.asset_bundle.assets.length; i++) {
      _summaryTokensSold += '::dummy'
      _numTokensSold++
    }
  }
  // Convert token(s) to array of subgraph's T_SaleLookupTable model
  const _reservoirLookupTable: T_SaleLookupTable[] = []
  // populate this with same data as defined in sales_repository.ts
  if (_saleType === 'Single') {
    // single sale
    // only push tokens that are in this TokenZero's project
    // (many projects can be in same OS collection)
    if (
      `${reservoirSale.token.contract}-${Math.floor(
        parseInt(reservoirSale.token.tokenId) / 1000000
      )}` === projectInfo.id
    ) {
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
          curationStatus: 'factory', //projectInfo.curationStatus ?? 'factory',
          additionalPayee: projectInfo.additionalPayee ?? null,
          additionalPayeePercentage: projectInfo.additionalPayeePercentage
            ? parseFloat(projectInfo.additionalPayeePercentage)
            : null,
        },
      }
      _openSeaLookupTables.push({
        id: `${tokenZero.id}::${_token.id}::${_event.id}`,
        token: _token,
      })
    }
  } else {
    // bundle sale
    // only include bundle sales if all tokens are in same collection
    if (
      _event.asset_bundle.assets.every((_asset, _, _asset_bundle) => {
        return _asset.collection.slug === _asset_bundle[0].collection.slug
      })
    ) {
      for (let i = 0; i < _event.asset_bundle.assets.length; i++) {
        // only add the assets that are in this collection
        // (since we will get other collections from OS API elsewhere)
        let openSeaCollectionSlug: string =
          _event.asset_bundle.assets[i].collection.slug
        if (
          openSeaCollectionSlug.includes(collectionSlug) &&
          openSeaCollectionSlug !== collectionSlug
        ) {
          console.warn(
            `[WARN] Token id ${_event.asset_bundle.assets[i].token_id} expected in OpenSea collection ${collectionSlug}, but actually in ${openSeaCollectionSlug}. Analyzing as if in expected collection slug: ${collectionSlug} because very similar.`
          )
          console.warn(
            '[WARN] Please contact Devs or OpenSea to have token above moved to correct collection.'
          )
          _event.asset_bundle.assets[i].collection.slug = collectionSlug
        }
        if (_event.asset_bundle.assets[i].collection.slug === collectionSlug) {
          // only push tokens that are in this TokenZero's project
          // (many projects can be in same OS collection)
          if (
            `${
              _event.asset_bundle.assets[i].asset_contract.address
            }-${Math.floor(
              parseInt(_event.asset_bundle.assets[i].token_id) / 1000000
            )}` === tokenZero.id
          ) {
            const _token: T_Token = {
              id: `${tokenZero.tokens[0].contract.id}-${_event.asset_bundle.assets[i].token_id}`,
              tokenId: _event.asset_bundle.assets[i].token_id,
              contract: { ...tokenZero.tokens[0].contract },
              project: { ...tokenZero.tokens[0].project },
            }
            _openSeaLookupTables.push({
              id: `${tokenZero.id}::${_token.id}::${_event.id}`,
              token: _token,
            })
          }
        } else {
          // Unexpected behavior
          console.error(
            `[ERROR] Uniform Bundle sale containing tokens from different collection encountered. Unexpected response from OpenSea API.`
          )
          console.warn(
            `[ERROR] Sale tx hash: ${_event.transaction.transaction_hash}`
          )
          console.info(
            `[ERROR] OS API's reported token collection slug: ${_event.asset_bundle.assets[i].collection.slug}`
          )
          console.info(`[ERROR] expected slug: ${collectionSlug}`)
          throw '[ERROR] Unexpected OS API response - please contact devs'
        }
      }
    } else {
      console.warn(
        `[WARN] Unexpected, but have observed - OpenSea api included a bundle sale with tokens in different collection slugs. Skipping, because don't expect OpenSea to have collected Artist royalties. Sale tx hash: ${_event.transaction.transaction_hash}`
      )
    }
  }
  /**
   * ref: Example of two squiggles in bulk private sale, OS collected 10%,
   * so include bulk private sales with all tokens in same collection.
   * tx: 0x2e3fb6389523431ff3a52f1ccb8a24ab9985b2a8f76730b2432a15150afc110d
   */

  // complete conversion to subgraph T_OpenSeaSale model
  try {
    if (_event.payment_token === null) {
      console.warn(
        "[WARN] Payment token is NULL from OpenSea's api. " +
          'This has been observed at least once, and assumption that payment ' +
          'token was ETH was valid. Assuming ETH is payment token, but ' +
          'recommend validating on etherscan.'
      )
      console.warn(
        `[WARN] The relavent tx for msg above is: ${_event.transaction.transaction_hash}`
      )
      // assign payment token to ETH
      _event.payment_token = {
        address: '0x0000000000000000000000000000000000000000',
      }
    }
    const _sale: T_Sale = {
      id: _event.id,
      exchange: 'OS_Vunknown',
      saleType: _saleType,
      blockNumber: _event.transaction.block_number,
      blockTimestamp: _event.transaction.timestamp,
      seller: _event.transaction.to_account.address,
      buyer: _event.winner_account.address,
      paymentToken: _event.payment_token.address,
      price: _event.total_price,
      isPrivate: _event.is_private,
      summaryTokensSold: _summaryTokensSold,
      saleLookupTables: _openSeaLookupTables,
    }
    return _sale
  } catch (e) {
    console.error('[ERROR] Error in OpenSeaSaleConverter')
    console.error(_event)
    console.error(_event.payment_token)
    throw e
  }
}

// returns OpenSea sales events for a given collection slug between timestamp
// bound (exclusive).
// only returns sales performed on OpenSea's contracts.
export async function getReservoirSalesForProject(
  projectInfo: ProjectData,
  startTimestamp: number,
  endTimestamp: number
): Promise<T_Sale[]> {
  const reservoirSales: T_Sale[] = []
  let _continuation = ''
  while (true) {
    let url = `https://api.reservoir.tools/sales/v4?&collection=${projectInfo.reservoirCollectionString}&limit=${SALES_BATCH_SIZE}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`
    if (_continuation !== '') {
      url = url + `&continuation=${_continuation}`
    }

    let response = await axios.get<ProjectCollectionResponse>(url, {
      headers: {
        'x-api-key': process.env.RESERVOIR_API_KEY ?? '',
      },
      timeout: RESERVOIR_TIMEOUT,
    })
    let data = response.data

    data.sales.forEach((sale) => {
      reservoirSales.push(reservoirSaleModelToSubgraphModel(projectInfo, sale))
    })
    if (data.continuation == null) {
      // reached end of reservoir's pagination
      break
    }
    _continuation = data.continuation
  }

  // loop through all new opensea sales to check if any before minBlockNumber
  // if so, skip them, and also we can break out of loop because we are
  // far enough back in time!
  let _reachedMinBlockNumber = false
  for (let i = 0; i < reservoirSales.length; i++) {
    // only include if new sale's block is >= minBlock
    if (newReservoirSales[i].blockNumber >= minBlockNumber) {
      openSeaSales.push(newOpenSeaSales[i])
    } else if (newOpenSeaSales[i].blockNumber === null) {
      // have observed OS API return this for failed transactions
      // sale did not occur (even though a successful event), so just skip
      console.debug(
        `[DEBUG] Skipped failed tx with null block number on collection ${collectionSlug}`
      )
    } else {
      // valid block number less than min block number, break out of scrolling
      _reachedMinBlockNumber = true
    }
  }
  return openSeaSales
}
