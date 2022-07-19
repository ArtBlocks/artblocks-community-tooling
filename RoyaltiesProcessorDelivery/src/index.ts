import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import fetch from 'node-fetch'

import {
  REPORTS_FOLDER,
  URL_GRAPHQL_ENDPOINT,
  BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES,
  AB_FLAGSHIP_CONTRACTS,
} from './constant'
import { arraysEqual } from './utils/util_functions'
import { GraphQLDatasource } from './datasources/graphQL_datasource'
import { SalesRepository } from './repositories/sales_repository'
import { ReportService } from './services/report_service'
import { SalesService } from './services/sales_service'
import { T_Sale } from './types/graphQL_entities_def'
import { exit } from 'process'
import { TokenZeroRepository } from './repositories/token_zero_repository'
import { getOpenSeaAssetCollectionSlug } from './repositories/opensea_api'
import { Exchange, Collection, SalesFilter } from './types/filters'

// import config file of pbab projects on flagship contracts
import { default as pbabProjectsOnFlagshipConfig } from '../config/pbabProjectsOnFlagship.json'

// Instanciate datasources, repositories and services
const graphQLDatasource = new GraphQLDatasource(URL_GRAPHQL_ENDPOINT)
const salesRepository = new SalesRepository(graphQLDatasource)
const tokenZeroRepository = new TokenZeroRepository(graphQLDatasource)
const saleService = new SalesService(salesRepository, tokenZeroRepository)

const reportService = new ReportService()

function generateFriendlyCsvOutputFilePath(
  command: string,
  previousBlock: number,
  currentBlock: number,
  useOpenSeaApi: boolean,
  salesFilter: SalesFilter
): string {
  const collectionFilterSuffix = salesFilter.collectionFilter
    ? `_${salesFilter.collectionFilter}`
    : ''
  const exchangeFilterSuffix = salesFilter.exchangeFilter
    ? `_${salesFilter.exchangeFilter}`
    : ''
  const osApiSuffix = useOpenSeaApi ? '_osAPI' : ''
  return (
    REPORTS_FOLDER +
    `/${command}_${previousBlock}_${currentBlock}${collectionFilterSuffix}${exchangeFilterSuffix}${osApiSuffix}.csv`
  )
}

/**
 * This gets latest block number via fetch of etherscan api
 */
async function getCurrentBlockNumber() {
  const response = await fetch(
    'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber'
  )
  const data: any = await response.json()
  return parseInt(data.result, 16)
}

/**
 * This handles special cases such as when PBAB contracts are on flagship core.
 * Returns two arrays - projectIds to include, and projectIds to exclude, where
 * projectIds are in same format as Project entity id in our subgraph.
 */
function getProjectIdsToExcludeAndAdd(salesFilter: SalesFilter) {
  const contractFilterType = salesFilter.contractFilterType
  const contractsFilter = salesFilter.contractsFilter
  // if flagship, exclude all pbab projects on flagship
  const projectIdsToExclude: string[] = []
  if (
    contractFilterType === 'ONLY' &&
    arraysEqual(contractsFilter, AB_FLAGSHIP_CONTRACTS)
  ) {
    projectIdsToExclude.push(
      ...Object.keys(pbabProjectsOnFlagshipConfig).map((_projectId) =>
        _projectId.toLowerCase()
      )
    )
  }
  // if limited to a single PBAB address, include core contract tokens that
  // tree under that pbab project
  const projectIdsToAdd: string[] = []
  if (
    contractsFilter?.length === 1 &&
    !AB_FLAGSHIP_CONTRACTS.includes(contractsFilter![0])
  ) {
    // For each item in config, if pbab contract is contract being filtered to,
    // add projectId to the array of projectIds to add
    Object.keys(pbabProjectsOnFlagshipConfig).forEach((_projectId) => {
      if (
        contractsFilter![0] ===
        pbabProjectsOnFlagshipConfig[_projectId].pbab_contract.toLowerCase()
      ) {
        projectIdsToAdd.push(_projectId.toLowerCase())
      }
    })
  }
  return { projectIdsToExclude, projectIdsToAdd }
}

/**
 * This processes all Art Blocks NFT sales that occured in a given ETH mainnet
 * block range.
 */
async function processSales(
  blockRange: [number, number],
  salesFilter: SalesFilter,
  useOpenSeaApi: boolean,
  pbabInvoice: boolean,
  csvOutputFilePath?: string,
  debug?: boolean
) {
  // apply special cases based on desired filter
  /** Handle excluded projectIds by filtering them out later in this function
   * we handle adding extra projects by not filtering them out in this function, and:
   *  - OpenSea API mode - explicitly including projectIdsToAdd
   *  - subgraph mode - nothing more; already query for every token sale by default because subgraph is fast
   */
  const { projectIdsToExclude, projectIdsToAdd } =
    getProjectIdsToExcludeAndAdd(salesFilter)

  const collectionFilter = salesFilter.collectionFilter
  const contractFilterType = salesFilter.contractFilterType
  const contractsFilter = salesFilter.contractsFilter
  const exchangeFilter = salesFilter.exchangeFilter

  let sales: T_Sale[]
  if (!useOpenSeaApi) {
    // get all sales of all tokens in blockrange in subgraph from subgraph
    sales = await saleService.getAllSalesBetweenBlockNumbers(blockRange)
  } else {
    // require an ONLY filter and a contractsFilter in OS API mode
    if (
      salesFilter.contractFilterType !== 'ONLY' ||
      salesFilter.contractsFilter === undefined
    ) {
      throw 'ONLY filter for subset of contracts is required when using OpenSea API mode'
    }
    // use OpenSea api instead of our subgraph to build an sales object
    if (exchangeFilter === undefined) {
      throw 'Exchange filter is required when using OpenSea API mode'
    }
    sales = await saleService.getAllSalesBetweenBlockNumbersOsApi(
      blockRange,
      salesFilter.contractsFilter,
      projectIdsToAdd,
      exchangeFilter
    )
  }

  console.info(`[INFO] ${sales.length} sales have been fetched`)

  // filter out all subgraph bundles with > 1 OpenSea collection slug
  // (in series to slow down because OpenSea API is rate limited)
  console.info(
    '[INFO] Getting OpenSea collection slugs for tokens in bundle sales... (cached upon receipt)'
  )
  let bundleSalesWithMultipleCollectionSlugs = 0
  if (!useOpenSeaApi) {
    // sales without royalties already not included when in OS API mode
    const filteredSales: T_Sale[] = []
    for (let i = 0; i < sales.length; i++) {
      const _sales = sales[i]
      if (
        _sales.exchange !== 'OS_V1' &&
        _sales.exchange !== 'OS_V2' &&
        _sales.exchange !== 'OS_SP'
      ) {
        // filtering logic after this is only for OpenSea bulk sales
        filteredSales.push(_sales)
        continue
      }
      const summaryTokensSold = _sales.summaryTokensSold.split('::')
      if (summaryTokensSold.length == 1) {
        // single sale, keep
        filteredSales.push(_sales)
      } else {
        // bundle sale
        const contractsAndTokenIds = summaryTokensSold.map((_id) => {
          return _id.split('-')
        })
        // get OpenSea collection slug for each token in sale
        const collectionSlugs: string[] = []
        for (let j = 0; j < contractsAndTokenIds.length; j++) {
          const _collectionSlug = await getOpenSeaAssetCollectionSlug(
            contractsAndTokenIds[j][0],
            contractsAndTokenIds[j][1]
          )
          collectionSlugs.push(_collectionSlug)
        }
        // add as sale w/royalties only if all collection slugs are same
        if (
          collectionSlugs.every((_slug, _, _slugs) => {
            return _slug === _slugs[0]
          })
        ) {
          filteredSales.push(_sales)
        } else {
          console.info(
            `[INFO] Skipped bundle sale because multiple OS collection slugs (expect no royalties collected): ${_sales.id}`
          )
          bundleSalesWithMultipleCollectionSlugs++
        }
      }
    }
    sales = filteredSales
  }
  console.info(
    `[INFO] Removed ${bundleSalesWithMultipleCollectionSlugs} Bundle OS sales with tokens from >1 OpenSea Collection Slug.`
  )

  let additionalSalesFoundInBundledSales = 0
  let skippedOtherContractsTokens = 0
  let skippedCurationStatus = 0
  let addedTokensOnFlagship = 0
  let excludedTokensOnFlagship = 0

  /* Among all sales, filter those we are interested in.
   * Filter the sales that match the given SalesFilter
   * Modifies IN PLACE the sale.saleLookupTables list to remove any saleLookupTable
   * that did not match the filter. If for a given sale, there was no SaleLookupTable (several
   * for bundle sale) that passed the filter, the sale is filtered.
   */
  sales = sales.filter((sale: T_Sale) => {
    const saleLookupTable = sale.saleLookupTables

    let nbTokenSold = 0
    let filteredSaleLookupTables = saleLookupTable.filter((saleLookupTable) => {
      nbTokenSold += 1

      if (nbTokenSold > 1) {
        additionalSalesFoundInBundledSales += 1
      }

      const token = saleLookupTable.token
      const exchange = sale.exchange

      // special case: projectId in projectIdsToAdd
      if (projectIdsToAdd.includes(token.project.id)) {
        addedTokensOnFlagship++
        return true
      }

      // special case: projectId in projectIdsToExclude
      if (projectIdsToExclude.includes(token.project.id)) {
        excludedTokensOnFlagship++
        return false
      }

      const curationFilterPass =
        collectionFilter == undefined ||
        token.project.curationStatus === collectionFilter

      const exchangeFilterPass =
        exchangeFilter === undefined ||
        // OpenSea API mode filters for exchange before this point
        useOpenSeaApi ||
        (exchangeFilter === 'OS_Wyvern' && exchange.startsWith('OS_V')) ||
        (exchangeFilter === 'OS_Seaport' && exchange == 'OS_SP') ||
        (exchangeFilter === 'OS_All' && exchange.startsWith('OS_')) ||
        exchangeFilter === exchange

      const contractsFilterPass =
        contractFilterType === undefined ||
        (contractFilterType == 'ONLY' &&
          contractsFilter!.includes(token.contract.id)) ||
        (contractFilterType == 'ONLY_NOT' &&
          !contractsFilter!.includes(token.contract.id))

      if (curationFilterPass === false) {
        skippedCurationStatus += 1
      } else if (contractsFilterPass === false) {
        skippedOtherContractsTokens += 1
      }

      return curationFilterPass && contractsFilterPass && exchangeFilterPass
    })

    // Replace the saleLookupTable by the filteredSaleLookupTable
    sale.saleLookupTables = filteredSaleLookupTables
    return sale.saleLookupTables.length > 0
  })

  // report any tokens added on flagship
  if (addedTokensOnFlagship > 0) {
    console.info(
      `[INFO] Added ${addedTokensOnFlagship} ` +
        `individual token sales on flagship in projectIds: ${projectIdsToAdd}`
    )
  }

  // report any tokens excluded on flagship
  if (excludedTokensOnFlagship > 0) {
    console.info(
      `[INFO] Excluded ${excludedTokensOnFlagship} ` +
        `individual token sales on flagship in projectIds: ${projectIdsToExclude}`
    )
  }

  // report any additional tokens found
  if (additionalSalesFoundInBundledSales > 0) {
    console.info(
      `[INFO] Found ${additionalSalesFoundInBundledSales} ` +
        `additional individual token sales while un-bundling bundled sales`
    )
  }

  // report curation status tokens skipped
  if (skippedCurationStatus) {
    console.info(
      `[INFO] Skipped ${skippedCurationStatus} ` +
        `tokens not in collection ${collectionFilter}`
    )
  }

  // report any different contract tokens skipped
  if (skippedOtherContractsTokens) {
    console.info(
      `[INFO] Skipped ${skippedOtherContractsTokens} ` +
        `tokens because of ${contractFilterType} in [${contractsFilter}]`
    )
  }

  console.info(`[INFO] ${sales.length} sales after filtering`)

  // Filter private sales
  sales = sales.filter((sale) => SalesService.saleHasRoyalties(sale))

  console.info(
    `[INFO] ${sales.length} sales remaining after filtering ` +
      `private sales without royalties (prior to block ` +
      `${BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES})`
  )

  // if nothing found, alert and return
  if (sales.length <= 0) {
    console.info('[INFO] No sales found (nothing to process), exiting')
    return
  }

  const projectReports = saleService.generateProjectReports(sales)

  if (csvOutputFilePath !== undefined) {
    if (pbabInvoice) {
      reportService.generatePBABInvoiceCSVFromProjectReports(
        blockRange,
        Array.from(projectReports.values()),
        csvOutputFilePath.replace(
          '.csv',
          `_pbab_invoice_${contractsFilter!.toString()}.csv`
        ),
        contractsFilter!.toString()
      )
      return
    }
    const csvRawOutputFilePath = csvOutputFilePath.replace('.csv', '_raw.csv')
    const csvDetailedOutputFilePath = csvOutputFilePath.replace(
      '.csv',
      '_detailed.csv'
    )
    reportService.generateCSVFromProjectReports(
      blockRange,
      Array.from(projectReports.values()),
      csvOutputFilePath
    )
    reportService.generateDetailedCSVFromProjectReports(
      blockRange,
      Array.from(projectReports.values()),
      csvDetailedOutputFilePath
    )
    reportService.generateRawCSVFromProjectReports(
      blockRange,
      Array.from(projectReports.values()),
      csvRawOutputFilePath
    )
    if (debug) {
      const debugOutputFilePath = csvOutputFilePath.replace(
        '.csv',
        '_DEBUG_ALL_SALE_IDS.csv'
      )
      reportService.generateDebugCSVFromProjectReports(
        sales,
        debugOutputFilePath
      )
    }
    return
  }
  // Print output to console
  reportService.outputReportToConsole(
    blockRange,
    Array.from(projectReports.values())
  )
}

yargs(hideBin(process.argv))
  .strict()
  .command(
    'range <startingBlock> [endingBlock] [collection] [flagship] [csv] [outputPath]',
    'Process all Opensea and LooksRare sales after startingBlock (included) and before endingBlock (excluded)',
    (yargs) => {
      yargs
        .positional('startingBlock', {
          description:
            'Only the sales between the given block numbers ([startingBlock; endingBlock[) will be processed.',
          type: 'number',
        })
        .option('endingBlock', {
          description:
            'Only the sales between the given block numbers ([startingBlock; endingBlock[) will be processed. If no endingBlock is provided it will run up to the current block number',
          type: 'number',
        })
        .option('collection', {
          description: 'A filter to only process sales of the given collection',
          type: 'string',
          choices: ['curated', 'playground', 'factory'],
        })
        .option('flagship', {
          description:
            'A filter to only process sales of Art Blocks flagship product (i.e. excludes PBAB)',
          type: 'boolean',
          conflicts: 'PBAB',
        })
        .option('PBAB', {
          description:
            'A filter to only process sales of Art Blocks PBAB products',
          type: 'boolean',
          conflicts: ['flagship', 'collection'],
        })
        .option('contract', {
          description:
            'A filter to only process sales of the given contract address',
          type: 'string',
          conflicts: ['flagship', 'PBAB'],
        })
        .option('csv', {
          description:
            'If present, the output will be written to CSV files. Else the results will printed to the console.',
          type: 'boolean',
        })
        .option('outputPath', {
          implies: 'csv',
          description:
            'Specify the file path where the CSV files will be stored. Requires the --csv flag to be set.',
          type: 'string',
        })
        .option('osAPI', {
          description:
            'If present, the OpenSea api will be used instead of the subgraph. requires either: --flagship OR --contract.',
          type: 'boolean',
          conflicts: ['collection', 'PBAB'],
        })
        .option('pbabInvoice', {
          description:
            'Generates a PBAB invoice summary report. Requires a single PBAB core contract arg.',
          type: 'boolean',
          conflicts: ['flagship', 'PBAB', 'collection'],
          implies: ['contract', 'csv'],
        })
        .option('exchange', {
          description: 'Only the sales coming from a given exchange.',
          type: 'string',
          choices: [
            'OS_V1',
            'OS_V2',
            'OS_Wyvern',
            'OS_Seaport',
            'OS_All',
            'LR_V1',
          ],
        })
        .option('DEBUG', {
          description:
            'If present, a csv file will be output containing all sale IDs for the generated csv reports',
          type: 'boolean',
        })
    },
    async (argv) => {
      let startingBlock = argv.startingBlock as number
      let endingBlock = argv.endingBlock as number

      let writeToCsv = argv.csv !== undefined
      let outputPath = argv.outputPath as string | undefined

      let useOpenSeaApi = argv.osAPI as boolean | false
      console.info('[INFO] Use OpenSea API Mode? -> ', !!useOpenSeaApi)
      let debug = argv.DEBUG as boolean | false
      if (debug) {
        console.info('[INFO] Debug Mode Enabled')
      }

      const collection = argv.collection as Collection | undefined
      const exchange = argv.exchange as Exchange | undefined
      let salesFilter: SalesFilter = {
        collectionFilter: collection,
        exchangeFilter: exchange,
      }

      // Those 3 optional params are conflicting with each others, only one
      // can be specified at a time
      const flagship = argv.flagship as boolean | undefined
      const pbab = argv.PBAB as boolean | undefined
      const pbabInvoice = argv.pbabInvoice as boolean | undefined
      let contract = argv.contract as string | undefined
      if (useOpenSeaApi && !flagship && !contract) {
        console.error(
          '[ERROR] OpenSea API mode currently only supports --flagship or --contract mode'
        )
        throw 'invalid configuration'
      }

      if (
        useOpenSeaApi &&
        !(
          exchange === 'OS_Wyvern' ||
          exchange === 'OS_Seaport' ||
          exchange === 'OS_All'
        )
      ) {
        console.error(
          '[ERROR] Exchange filter of OS_Wyvern, OS_Seaport, or OS_All is required when using OpenSea API mode'
        )
        throw 'invalid configuration'
      }

      if (flagship) {
        salesFilter.contractFilterType = 'ONLY'
        salesFilter.contractsFilter = AB_FLAGSHIP_CONTRACTS
      } else if (pbab) {
        salesFilter.contractFilterType = 'ONLY_NOT'
        salesFilter.contractsFilter = AB_FLAGSHIP_CONTRACTS
      } else if (contract) {
        contract = contract.toLowerCase()
        salesFilter.contractFilterType = 'ONLY'
        salesFilter.contractsFilter = [contract]
      }

      // ensure ending block < currentBlock via etherscan api
      const currentBlockNumber = await getCurrentBlockNumber()
      if (endingBlock === undefined) {
        endingBlock = currentBlockNumber
      }

      if (endingBlock > currentBlockNumber) {
        throw `Ending block (${endingBlock}) must be <= mainnet current block number: ${currentBlockNumber}!`
      }

      if (writeToCsv && outputPath === undefined) {
        outputPath = generateFriendlyCsvOutputFilePath(
          'since',
          startingBlock,
          endingBlock,
          useOpenSeaApi,
          salesFilter
        )
      }

      if (startingBlock >= endingBlock) {
        console.error(
          `The starting block number ${startingBlock} is greater than the ending block number ${endingBlock}`
        )
        exit(1)
      }
      await processSales(
        [startingBlock, endingBlock],
        salesFilter,
        !!useOpenSeaApi,
        !!pbabInvoice,
        outputPath,
        debug
      )
    }
  )
  .strict()
  .demandCommand()
  .help()
  .wrap((2 * yargs.terminalWidth()) / 2).argv
