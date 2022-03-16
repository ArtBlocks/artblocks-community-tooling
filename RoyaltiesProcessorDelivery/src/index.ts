import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fetch from "node-fetch";

import {
  REPORTS_FOLDER,
  URL_GRAPHQL_ENDPOINT,
  BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES,
} from "./constant";
import { GraphQLDatasource } from "./datasources/graphQL_datasource";
import { OpenseaSalesRepository } from "./repositories/opensea_sales_repository";
import { ReportService } from "./services/report_service";
import { OpenSeaSalesService } from "./services/opensea_sales_service";
import { T_OpenSeaSale } from "./types/graphQL_entities_def";
import { exit } from "process";

// Instanciate datasources, repositories and services
const graphQLDatasource = new GraphQLDatasource(URL_GRAPHQL_ENDPOINT);
const openSeaSalesRepository = new OpenseaSalesRepository(graphQLDatasource);
const openSeaSaleService = new OpenSeaSalesService(openSeaSalesRepository);
const reportService = new ReportService();

function generateFriendlyCsvOutputFilePath(
  command: string,
  previousBlock: number,
  currentBlock: number
): string {
  return REPORTS_FOLDER + `/${command}_${previousBlock}_${currentBlock}.csv`;
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
  curationStatus?: string,
  csvOutputFilePath?: string,
  flagship?: boolean,
  contract?: string
) {
  let openSeaSales = await openSeaSaleService.getAllSalesBetweenBlockNumbers(
    blockRange
  );

  // Among all sales filter to only get the provided collection if a filter has been specified
  // This is a pre-filter - includes OpenSeaSale if ANY of tokens transferred in desired collection
  // (a token-by-token check is performed in generateProjectReports to remove any remaining)
  if (curationStatus !== undefined) {
    openSeaSales = openSeaSales.filter((openSeaSale: T_OpenSeaSale) => {
      const openSeaSaleLookupTables = openSeaSale.openSeaSaleLookupTables;
      for (const tokenOpenSeaSaleLookupTable of openSeaSaleLookupTables) {
        const token = tokenOpenSeaSaleLookupTable.token;
        if (token.project.curationStatus === curationStatus) {
          return true;
        }
      }
      return false;
    });
  }

  // Among all sales filter to only get the provided contract if a filter has been specified
  // This is a pre-filter - includes OpenSeaSale if ANY of tokens transferred in desired contract
  // (a token-by-token check is performed in generateProjectReports to remove any remaining)
  if (contract !== undefined) {
    openSeaSales = openSeaSales.filter((openSeaSale: T_OpenSeaSale) => {
      const openSeaSaleLookupTables = openSeaSale.openSeaSaleLookupTables;
      for (const tokenOpenSeaSaleLookupTable of openSeaSaleLookupTables) {
        const token = tokenOpenSeaSaleLookupTable.token;
        if (token.contract.id === contract) {
          return true;
        }
      }
      return false;
    });
  }

  console.info(`[INFO] ${openSeaSales.length} OpenSea sales have been fetched`);

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

  const projectReports = openSeaSaleService.generateProjectReports(
    openSeaSales,
    curationStatus,
    flagship,
    contract
  );

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
        })
        .option("contract", {
          description:
            "A filter to only process sales of the given contract address",
          type: "string",
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
        });
    },
    async (argv) => {
      let startingBlock = argv.startingBlock as number;
      let endingBlock = argv.endingBlock as number;

      let writeToCsv = argv.csv !== undefined;
      let outputPath = argv.outputPath as string | undefined;
      const collection = argv.collection as string | undefined;
      const flagship = argv.flagship !== undefined;
      let contract = argv.contract as string | undefined;
      if (contract) {
        contract = contract.toLowerCase();
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
          endingBlock
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
        collection,
        outputPath,
        flagship,
        contract
      );
    }
  )
  .strict()
  .demandCommand()
  .help()
  .wrap((2 * yargs.terminalWidth()) / 2).argv;
