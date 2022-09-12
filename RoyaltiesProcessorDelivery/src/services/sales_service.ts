import { BigNumber, ethers } from 'ethers'
import { BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES } from '../constant'
import fetch from 'node-fetch'

import { delay, findCommonElements } from '../utils/util_functions'
import { SalesRepository } from '../repositories/sales_repository'
import { TokenZeroRepository } from '../repositories/token_zero_repository'
import {
  getOpenSeaAssetCollectionSlug,
  getOpenSeaSalesEvents,
} from '../repositories/opensea_api'
import { T_Sale, T_TokenZero } from '../types/graphQL_entities_def'
import { ProjectReport } from '../types/project_report'
import { Exchange } from '../types/filters'
import {
  ProjectData,
  SubgraphRepository,
} from '../repositories/subgraph_repository'
import { getReservoirSalesForContracts } from '../repositories/reservoir_api'

const flatCache = require('flat-cache')
const collectionSlugCache = flatCache.load('collectionSlugCache', '.slug_cache')

type T_SlugAndTokenZero = {
  collectionSlug: string
  tokenZero: T_TokenZero
}

/**
 * This gets timestamp for a given block number via fetch of etherscan api
 */
async function getBlockTimestamp(blockNumber) {
  const provider = new ethers.providers.AlchemyProvider('homestead')

  const timestamp = (await provider.getBlock(blockNumber)).timestamp
  return timestamp
}

export class SalesService {
  #saleRepository: SalesRepository
  #tokenZeroRepository: TokenZeroRepository
  #subgraphRepository: SubgraphRepository

  constructor(
    saleRepository: SalesRepository,
    tokenZeroRepository: TokenZeroRepository,
    subgraphRepository: SubgraphRepository
  ) {
    this.#saleRepository = saleRepository
    this.#tokenZeroRepository = tokenZeroRepository
    this.#subgraphRepository = subgraphRepository
  }

  static saleHasRoyalties(sale: T_Sale) {
    // OpenSea's API sometimes labels is_private as null when it appears to be true,
    // so treat null as true for our filter to be accurate.
    if (sale.isPrivate === null) {
      return true
    }
    return (
      sale.isPrivate === false ||
      (sale.isPrivate &&
        sale.blockNumber >= BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES)
    )
  }

  async getAllSalesBetweenBlockNumbers(
    blockRange: [number, number]
  ): Promise<T_Sale[]> {
    const first = 1000
    let sales: T_Sale[] = []
    let [blockNumberGte, blockNumberLt] = blockRange

    while (true) {
      console.log(
        `Fetching last ${first} sales from subgraph for block range: ` +
          `[${blockNumberGte}; ${blockNumberLt}[`
      )
      const newSales = await this.#saleRepository.getSalesBetweenBlockNumbers(
        { first, skip: 0 },
        blockNumberGte,
        blockNumberLt
      )

      if (newSales.length < first) {
        // found all remaining sales, no scroll required
        sales.push(...newSales)
        break
      }

      let blockNumberFinalSale = -1
      let foundBlockToSplit = false
      while (!foundBlockToSplit) {
        // We are fetching the sales in desc order by block number
        // Here the last sale will be the one with the lowest block number
        const lastSale = newSales.pop()!

        // Save the blocknumber of the initial last sale
        if (blockNumberFinalSale === -1) {
          blockNumberFinalSale = lastSale.blockNumber
          continue
        }

        // Next query blockNumberLt should be first block found that is different
        // than blockNumberFinalSale. This avoids sliding the query range
        // while being INSIDE a block, which would result in potential missed sales.
        // Add all sales found prior to blockNumberFinalSale.
        if (blockNumberFinalSale < lastSale.blockNumber) {
          // Repush the sale since we popped it
          newSales.push(lastSale)

          // set the higer bound of the range (exclusive) to the last sale
          // block number we just popped
          blockNumberLt = lastSale.blockNumber

          // Exit the searching loop
          foundBlockToSplit = true
        }
      }

      sales.push(...newSales)
    }
    console.log('')

    return sales
  }

  /**
   * This function mirrors getAllSalesBetweenBlockNumbers, but uses the OpenSea
   * API instead of subgraph. Still uses subgraph to get token zero of all
   * projects, which are required to enumerate collection slugs on OpenSea,
   * which are required to query sales events.
   * @param blockRange: start block (inclusive), end block (exclusive)
   * @param contracts: array of contract addresses (lower case) to inlclude in this search
   * @param projectIdsToAdd: array of projectIds to include in returned sales
   */
  async getAllSalesBetweenBlockNumbersOsApi(
    blockRange: [number, number],
    contracts: string[],
    projectIdsToAdd: string[],
    exchange: Exchange
  ): Promise<T_Sale[]> {
    const first = 1000
    // the thing we are retuning: sales array
    let openSeaSales: T_Sale[] = []
    // get token zeros for every project of interest
    let tokenZeros: T_TokenZero[] = []

    while (true) {
      console.log(`Fetching first ${first} token zeros from subgraph...`)
      const newTokenZeros =
        await this.#tokenZeroRepository.getAllTokenZerosOnContracts(
          {
            first,
            skip: 0,
          },
          contracts
        )

      if (newTokenZeros.length < first) {
        // found all remaining sales, no scroll required
        tokenZeros.push(...newTokenZeros)
        break
      } else {
        console.error(
          '[ERROR] found >1000 projects, tell devs to add capability to scroll! results invalid.'
        )
        throw 'Contact devs'
      }
      // warning to devs in future - when adding ability to scroll, keep in mind
      // that TheGraph has an upper limit on skip, so may need to filter in
      // some other way than just using projects() query if future-proofing.
    }
    // add any additional token zeros from projectIdsToAdd
    if (projectIdsToAdd.length > 0) {
      console.log(
        `Fetching additional token zeros from subgraph for projectIds: ${projectIdsToAdd}`
      )
      const newTokenZeros =
        await this.#tokenZeroRepository.getAllTokenZerosWithProjectIds(
          {
            first,
            skip: 0,
          },
          projectIdsToAdd
        )
      // double check that we aren't adding the same projectId twice
      // (should never happen, for bug catching only)
      if (
        findCommonElements(
          tokenZeros.map((_TokenZero) => _TokenZero.id),
          newTokenZeros.map((_newTokenZero) => _newTokenZero.id)
        )
      ) {
        throw 'projectIdsToAdd were already queried. This should never happen, check config file.'
      }
      // add valid new token zeros to array of total token zeros to return
      tokenZeros.push(...newTokenZeros)
    }
    console.log('')
    // query OpenSea api for every token zero to build array of collection slugs
    // iterate one-by-one to eliminate too-many-calls response from OS API
    // use local cache because this takes a long time due to OS's API.
    const slugsAndTokenZeros: T_SlugAndTokenZero[] = []
    for (let i = 0; i < tokenZeros.length; i++) {
      const _tokenZero = tokenZeros[i]
      console.info(
        `[INFO] Getting OS collection slug for: ${_tokenZero.tokens[0].project.name}`
      )
      let collectionSlug = collectionSlugCache.getKey(
        _tokenZero.tokens[0].project.id
      )
      if (collectionSlug !== undefined) {
        console.info(`[INFO] using cached collection slug ${collectionSlug}`)
        slugsAndTokenZeros.push({
          collectionSlug: collectionSlug,
          tokenZero: _tokenZero,
        })
      } else {
        collectionSlug = await getOpenSeaAssetCollectionSlug(
          _tokenZero.tokens[0].contract.id,
          _tokenZero.tokens[0].tokenId.toString()
        )
        slugsAndTokenZeros.push({
          collectionSlug: collectionSlug,
          tokenZero: _tokenZero,
        })
        // add slug to cache, save
        collectionSlugCache.setKey(
          _tokenZero.tokens[0].project.id,
          collectionSlug
        )
        collectionSlugCache.save(true)
      }
    }
    // OS api works in terms of timestamps, not blocks.
    let maxTimestamp = await getBlockTimestamp(blockRange[1])

    // retrieve all events in timestamp/block range, for each collection
    // populate openSeaSales along the way!
    let only_opensea: boolean[] = []
    if (exchange === 'OS_Wyvern') {
      only_opensea = [true]
    } else if (exchange === 'OS_All') {
      // per OpenSea for June 2022, includes only Wyvern + Seaport sales, could change in future, but only option for now
      only_opensea = [false]
    } else if (exchange === 'OS_Seaport') {
      // Seaport sales are the sales when only_opensea is false, minus salse wyvern sales when only_opensea is true
      only_opensea = [false, true]
    } else {
      throw 'Invalid exchange when using OpenSea API mode'
    }
    // iterate over all variations of only_opensea required to achieve desired end result
    const _openSeaSales: T_Sale[][] = []
    for (let i = 0; i < only_opensea.length; i++) {
      _openSeaSales.push([])
      // iterate over all collection slugs
      for (let j = 0; j < slugsAndTokenZeros.length; j++) {
        const _slugAndTokenZero = slugsAndTokenZeros[j]
        console.info(
          `[INFO] Getting OS sale events for: ${_slugAndTokenZero.collectionSlug}`
        )
        const _newOpenSeaSales = await getOpenSeaSalesEvents(
          _slugAndTokenZero.collectionSlug,
          _slugAndTokenZero.tokenZero,
          maxTimestamp,
          blockRange[0],
          only_opensea[i]
        )
        _openSeaSales[i].push(..._newOpenSeaSales)
      }
    }
    // if only seaport, filter out wyvern sales
    if (exchange === 'OS_Seaport') {
      openSeaSales = _openSeaSales[0].filter((sale) => {
        return (
          _openSeaSales[1].find((_sale) => _sale.id === sale.id) === undefined
        )
      })
    } else {
      // otherwise, no need to filter because able to be queried directly from OS API
      openSeaSales = _openSeaSales[0]
    }

    return openSeaSales
  }

  /**
   * This function mirrors getAllSalesBetweenBlockNumbers, but uses the Reservoir
   * API instead of subgraph. Still uses subgraph to get all the project info
   * @param blockRange: start block (inclusive), end block (exclusive)
   * @param contracts: array of contract addresses (lower case) to inlclude in this search
   * @param projectIdsToAdd: array of projectIds to include in returned sales
   */
  async getAllSalesBetweenBlockNumbersReservoirApi(
    blockRange: [number, number],
    contracts: string[]
  ): Promise<T_Sale[]> {
    let projectData: ProjectData[] = []
    projectData = await this.#subgraphRepository.getAllProjectInfo(contracts)

    // Reservoir api works in terms of timestamps, not blocks.
    let minTimestamp = await getBlockTimestamp(blockRange[0])
    let maxTimestamp = await getBlockTimestamp(blockRange[1])

    // create dictionary of project info
    const projectDict = {}

    for (let j = 0; j < projectData.length; j++) {
      const projectInfo = projectData[j]
      projectDict[`${projectInfo.contractAddress}-${projectInfo.projectId}`] =
        projectInfo
    }

    // Get the sales data from Reservoir!
    const _reservoirSales = await getReservoirSalesForContracts(
      contracts,
      projectDict,
      minTimestamp,
      maxTimestamp
    )

    return _reservoirSales
  }

  generateProjectReports(sales: T_Sale[]): Map<string, ProjectReport> {
    const projectReports = new Map<string, ProjectReport>()

    // Browse all sales
    for (const sale of sales) {
      const saleLookupTables = sale.saleLookupTables
      if (saleLookupTables.length === 0) {
        console.info('[found open sea sale with length of zero!]')
      }

      // In the pre-filtering stage we might have removed some so we can't
      // get the  number from the saleLookupTables list length
      const nbTokensSold = sale.summaryTokensSold.split('::').length

      // Browse the list of tokens sold in this sale
      // May be only one in the case of a "Single" sale
      // May be several in the case of a "Bundle" sale
      // In the case of "Bundle" sale only AB tokens are registered by the AB subgraph
      for (const tokenSaleLookupTable of saleLookupTables) {
        const token = tokenSaleLookupTable.token
        const project = token.project

        // Get/Instanciate the projectReport
        let projectReport = projectReports.get(project.name)
        if (projectReport === undefined) {
          projectReport = new ProjectReport(
            parseInt(project.id),
            project.name,
            project.artistAddress,
            project.additionalPayee,
            project.additionalPayeePercentage
          )
        }

        projectReport.addSale(sale, nbTokensSold)
        projectReports.set(project.name, projectReport)
      }
    }

    // Once all sales have been processed
    // we can compute the crypto due to artists
    for (const projectName of projectReports.keys()) {
      const projectReport = projectReports.get(projectName)!
      projectReport.computeCryptoDue()
    }

    return projectReports
  }
}
