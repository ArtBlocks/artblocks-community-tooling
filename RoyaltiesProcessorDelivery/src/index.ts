import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fetch from "node-fetch";

import {
  REPORTS_FOLDER,
  URL_GRAPHQL_ENDPOINT,
  BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES,
  AB_FLAGSHIP_CONTRACTS,
} from "./constant";
import { GraphQLDatasource } from "./datasources/graphQL_datasource";
import { OpenseaSalesRepository } from "./repositories/opensea_sales_repository";
import { ReportService } from "./services/report_service";
import { OpenSeaSalesService } from "./services/opensea_sales_service";
import { T_OpenSeaSale } from "./types/graphQL_entities_def";
import { exit } from "process";
import { TokenZeroRepository } from "./repositories/token_zero_repository";
import { getOpenSeaAssetCollectionSlug } from "./repositories/opensea_api";

// Instanciate datasources, repositories and services
const graphQLDatasource = new GraphQLDatasource(URL_GRAPHQL_ENDPOINT);
const openSeaSalesRepository = new OpenseaSalesRepository(graphQLDatasource);
const tokenZeroRepository = new TokenZeroRepository(graphQLDatasource);
const openSeaSaleService = new OpenSeaSalesService(
  openSeaSalesRepository,
  tokenZeroRepository
);

type Collection = "curated" | "playground" | "factory";

type OpenSeaSalesFilter = {
  collectionFilter?: Collection;
  contractFilterType?: "ONLY" | "ONLY_NOT";
  contractsFilter?: string[];
};

const reportService = new ReportService();

function generateFriendlyCsvOutputFilePath(
  command: string,
  previousBlock: number,
  currentBlock: number,
  useOpenSeaApi: boolean
): string {
  const osApiSuffix = useOpenSeaApi ? "_osAPI" : "";
  return (
    REPORTS_FOLDER +
    `/${command}_${previousBlock}_${currentBlock}${osApiSuffix}.csv`
  );
}

/**
 * This gets latest block number via fetch of etherscan api
 */
async function getCurrentBlockNumber() {
  const response = await fetch(
    "https://api.etherscan.io/api?module=proxy&action=eth_blockNumber"
  );
  const data: any = await response.json();
  return parseInt(data.result, 16);
}

/**
 * This processes all Art Blocks NFT sales that occured in a given ETH mainnet
 * block range.
 */
async function processSales(
  blockRange: [number, number],
  openseaSalesFilter: OpenSeaSalesFilter,
  useOpenSeaApi,
  csvOutputFilePath?: string
) {
  let openSeaSales: T_OpenSeaSale[];
  if (!useOpenSeaApi) {
    openSeaSales = await openSeaSaleService.getAllSalesBetweenBlockNumbers(
      blockRange
    );
  } else {
    // use OpenSea api instead of our subgraph to build an openSeaSales object
    openSeaSales = await openSeaSaleService.getAllSalesBetweenBlockNumbersOsApi(
      blockRange
    );
  }

  console.info(`[INFO] ${openSeaSales.length} OpenSea sales have been fetched`);

  // filter out all subgraph bundles with > 1 OpenSea collection slug
  // (in series to slow down because OpenSea API is rate limited)
  console.info(
    "[INFO] Getting OpenSea collection slugs for tokens in bundle sales... (cached upon receipt)"
  );
  let bundleSalesWithMultipleCollectionSlugs = 0;
  if (!useOpenSeaApi) {
    const filteredOpenSeaSales: T_OpenSeaSale[] = [];
    for (let i = 0; i < openSeaSales.length; i++) {
      const _openSeaSale = openSeaSales[i];
      const summaryTokensSold = _openSeaSale.summaryTokensSold.split("::");
      if (summaryTokensSold.length == 1) {
        // single sale, keep
        filteredOpenSeaSales.push(_openSeaSale);
      } else {
        // bundle sale
        const contractsAndTokenIds = summaryTokensSold.map((_id) => {
          return _id.split("-");
        });
        // get OpenSea collection slug for each token in sale
        const collectionSlugs: string[] = [];
        for (let j = 0; j < contractsAndTokenIds.length; j++) {
          const _collectionSlug = await getOpenSeaAssetCollectionSlug(
            contractsAndTokenIds[j][0],
            contractsAndTokenIds[j][1]
          );
          collectionSlugs.push(_collectionSlug);
        }
        // add as sale w/royalties only if all collection slugs are same
        if (
          collectionSlugs.every((_slug, _, _slugs) => {
            return _slug === _slugs[0];
          })
        ) {
          filteredOpenSeaSales.push(_openSeaSale);
        } else {
          bundleSalesWithMultipleCollectionSlugs++;
        }
      }
    }
    openSeaSales = filteredOpenSeaSales;
  }
  console.info(
    `[INFO] Removed ${bundleSalesWithMultipleCollectionSlugs} Bundle OS sales with tokens from >1 OpenSea Collection Slug.`
  );

  const collectionFilter = openseaSalesFilter.collectionFilter;
  const contractFilterType = openseaSalesFilter.contractFilterType;
  const contractsFilter = openseaSalesFilter.contractsFilter;

  let additionalSalesFoundInBundledSales = 0;
  let skippedOtherContractsTokens = 0;
  let skippedCurationStatus = 0;

  /* Among all sales, filter those we are interested in.
   * Filter the OpenSeaSales that match the given OpenSeaSalesFilter
   * Modifies IN PLACE the openSeaSale.openSeaSaleLookupTables list to remove any OpenSeaSaleLookupTable
   * that did not match the filter. If for a given openSeaSale, there was no OpenSeaSaleLookupTable (several
   * for bundle sale) that passed the filter, the openSeaSale is filtered.
   */
  openSeaSales = openSeaSales.filter((openSeaSale: T_OpenSeaSale) => {
    const openSeaSaleLookupTables = openSeaSale.openSeaSaleLookupTables;

    let nbTokenSold = 0;
    let filteredOpenSeaSaleLookupTables = openSeaSaleLookupTables.filter(
      (openSeaSaleLookupTable) => {
        nbTokenSold += 1;

        if (nbTokenSold > 1) {
          additionalSalesFoundInBundledSales += 1;
        }

        const token = openSeaSaleLookupTable.token;
        const curationFilterPass =
          collectionFilter == undefined ||
          token.project.curationStatus === collectionFilter;

        // TODO in future PR - need to check that ALL tokens in bundle have the
        // same OS collection slug or else OS doesn't pay royalties

        const contractsFilterPass =
          contractFilterType === undefined ||
          (contractFilterType == "ONLY" &&
            contractsFilter!.includes(token.contract.id)) ||
          (contractFilterType == "ONLY_NOT" &&
            !contractsFilter!.includes(token.contract.id));

        if (curationFilterPass === false) {
          skippedCurationStatus += 1;
        } else if (contractsFilterPass === false) {
          skippedOtherContractsTokens += 1;
        }

        return curationFilterPass && contractsFilterPass;
      }
    );

    // WARNING: Replace the openSeaSaleLookupTables by the filteredOpenSeaSaleLookupTables
    openSeaSale.openSeaSaleLookupTables = filteredOpenSeaSaleLookupTables;
    return openSeaSale.openSeaSaleLookupTables.length > 0;
  });

  // report any additional tokens found
  if (additionalSalesFoundInBundledSales > 0) {
    console.info(
      `[INFO] Found ${additionalSalesFoundInBundledSales} ` +
        `additional individual token sales while un-bundling bundled sales`
    );
  }

  // report curation status tokens skipped
  if (skippedCurationStatus) {
    console.info(
      `[INFO] Skipped ${skippedCurationStatus} ` +
        `tokens not in collection ${collectionFilter}`
    );
  }

  // report any different contract tokens skipped
  if (skippedOtherContractsTokens) {
    console.info(
      `[INFO] Skipped ${skippedOtherContractsTokens} ` +
        `tokens because of ${contractFilterType} in [${contractsFilter}]`
    );
  }

  console.info(`[INFO] ${openSeaSales.length} OpenSea sales after filtering`);

  // Filter private sales
  openSeaSales = openSeaSales.filter((sale) =>
    OpenSeaSalesService.saleHasRoyalties(sale)
  );

  console.info(
    `[INFO] ${openSeaSales.length} OpenSea sales remaining after filtering ` +
      `private sales without royalties (prior to block ` +
      `${BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES})`
  );

  // if nothing found, alert and return
  if (openSeaSales.length <= 0) {
    console.info("[INFO] No sales found (nothing to process), exiting");
    return;
  }

  const projectReports =
    openSeaSaleService.generateProjectReports(openSeaSales);

  if (csvOutputFilePath !== undefined) {
    const csvRawOutputFilePath = csvOutputFilePath.replace(".csv", "_raw.csv");
    const csvDetailedOutputFilePath = csvOutputFilePath.replace(
      ".csv",
      "_detailed.csv"
    );
    reportService.generateCSVFromProjectReports(
      blockRange,
      Array.from(projectReports.values()),
      csvOutputFilePath
    );
    reportService.generateDetailedCSVFromProjectReports(
      blockRange,
      Array.from(projectReports.values()),
      csvDetailedOutputFilePath
    );
    reportService.generateRawCSVFromProjectReports(
      blockRange,
      Array.from(projectReports.values()),
      csvRawOutputFilePath
    );
  } else {
    // Print output to console
    reportService.outputReportToConsole(
      blockRange,
      Array.from(projectReports.values())
    );
  }
}

yargs(hideBin(process.argv))
  .strict()
  .command(
    "range <startingBlock> [endingBlock] [collection] [flagship] [csv] [outputPath]",
    "Process all Opensea sales after startingBlock (included) and before endingBlock (excluded)",
    (yargs) => {
      yargs
        .positional("startingBlock", {
          description:
            "Only the sales between the given block numbers ([startingBlock; endingBlock[) will be processed.",
          type: "number",
        })
        .option("endingBlock", {
          description:
            "Only the sales between the given block numbers ([startingBlock; endingBlock[) will be processed. If no endingBlock is provided it will run up to the current block number",
          type: "number",
        })
        .option("collection", {
          description: "A filter to only process sales of the given collection",
          type: "string",
          choices: ["curated", "playground", "factory"],
        })
        .option("flagship", {
          description:
            "A filter to only process sales of Art Blocks flagship product (i.e. excludes PBAB)",
          type: "boolean",
          conflicts: "PBAB",
        })
        .option("PBAB", {
          description:
            "A filter to only process sales of Art Blocks PBAB products",
          type: "boolean",
          conflicts: "flagship",
        })
        .option("contract", {
          description:
            "A filter to only process sales of the given contract address",
          type: "string",
          conflicts: ["flagship", "PBAB"],
        })
        .option("csv", {
          description:
            "If present, the output will be written to CSV files. Else the results will printed to the console.",
          type: "boolean",
        })
        .option("outputPath", {
          implies: "csv",
          description:
            "Specify the file path where the CSV files will be stored. Requires the --csv flag to be set.",
          type: "string",
        })
        .option("osAPI", {
          description:
            "If present, the OpenSea api will be used instead of the subgraph. FLAGSHIP ONLY (NO PBAB).",
          type: "boolean",
          conflicts: "PBAB",
        });
    },
    async (argv) => {
      let startingBlock = argv.startingBlock as number;
      let endingBlock = argv.endingBlock as number;

      let writeToCsv = argv.csv !== undefined;
      let outputPath = argv.outputPath as string | undefined;

      let useOpenSeaApi = argv.osAPI as boolean | false;
      console.info("[INFO] Use OpenSea API Mode? -> ", !!useOpenSeaApi);

      const collection = argv.collection as Collection | undefined;
      let openSeaSalesFilter: OpenSeaSalesFilter = {
        collectionFilter: collection,
      };

      // Those 3 optional params are conflicting with each others, only one
      // can be specified at a time
      const flagship = argv.flagship as boolean | undefined;
      const pbab = argv.PBAB as boolean | undefined;
      if (useOpenSeaApi && !flagship) {
        console.error(
          "[ERROR] OpenSea API mode currently requires the --flagship flag"
        );
        throw "invalid configuration";
      }
      let contract = argv.contract as string | undefined;
      if (useOpenSeaApi && !flagship) {
        console.error(
          "[ERROR] OpenSea API mode currently does not support single contract mode"
        );
        throw "invalid configuration";
      }

      if (flagship) {
        openSeaSalesFilter.contractFilterType = "ONLY";
        openSeaSalesFilter.contractsFilter = AB_FLAGSHIP_CONTRACTS;
      } else if (pbab) {
        openSeaSalesFilter.contractFilterType = "ONLY_NOT";
        openSeaSalesFilter.contractsFilter = AB_FLAGSHIP_CONTRACTS;
      } else if (contract) {
        contract = contract.toLowerCase();
        openSeaSalesFilter.contractFilterType = "ONLY";
        openSeaSalesFilter.contractsFilter = [contract];
      }

      // ensure ending block < currentBlock via etherscan api
      const currentBlockNumber = await getCurrentBlockNumber();
      if (endingBlock === undefined) {
        endingBlock = currentBlockNumber;
      }

      if (endingBlock > currentBlockNumber) {
        throw `Ending block (${endingBlock}) must be <= mainnet current block number: ${currentBlockNumber}!`;
      }

      if (writeToCsv && outputPath === undefined) {
        outputPath = generateFriendlyCsvOutputFilePath(
          "since",
          startingBlock,
          endingBlock,
          useOpenSeaApi
        );
      }

      if (startingBlock >= endingBlock) {
        console.error(
          `The starting block number ${startingBlock} is greater than the ending block number ${endingBlock}`
        );
        exit(1);
      }
      await processSales(
        [startingBlock, endingBlock],
        openSeaSalesFilter,
        useOpenSeaApi,
        outputPath
      );
    }
  )
  .strict()
  .demandCommand()
  .help()
  .wrap((2 * yargs.terminalWidth()) / 2).argv;
