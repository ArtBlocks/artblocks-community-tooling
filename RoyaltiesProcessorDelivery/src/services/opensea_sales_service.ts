import { BigNumber } from "ethers";
import {
  BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES,
} from "../constant";
import fetch from "node-fetch";

import { delay } from "../utils/util_functions";
import { OpenseaSalesRepository } from "../repositories/opensea_sales_repository";
import { TokenZeroRepository } from "../repositories/token_zero_repository";
import {
  getOpenSeaAssetCollectionSlug,
  getOpenSeaSalesEvents,
} from "../repositories/opensea_api";
import { T_OpenSeaSale, T_TokenZero } from "../types/graphQL_entities_def";
import { ProjectReport } from "../types/project_report";
import { UniqueDirectiveNamesRule } from "graphql";

const flatCache = require("flat-cache");
const collectionSlugCache = flatCache.load(
  "collectionSlugCache",
  ".slug_cache"
);

type T_SlugAndTokenZero = {
  collectionSlug: string;
  tokenZero: T_TokenZero;
};

/**
 * This gets timestamp for a given block number via fetch of etherscan api
 */
async function getBlockTimestamp(blockNumber) {
  let success = false;
  let retries = 0;
  const maxRetries = 5;
  let data: any;
  while (!success) {
    const response = await fetch(
      `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}`
    );
    data = await response.json();
    if (data.result.timeStamp !== undefined) {
      success = true;
    } else {
      if (retries >= maxRetries) {
        console.error(
          `[ERROR] reached maximum retries when getting block timestamp via etherscan api for block number ${blockNumber}`
        );
        throw "[ERROR] exiting due to etherscan api failure";
      }
      retries++;
      console.warn(
        `[WARN] Etherscan API failure... Retry ${retries} of ${maxRetries}...`
      );
      await delay(5000);
    }
  }
  return parseInt(data.result.timeStamp);
}

export class OpenSeaSalesService {
  #openSeaSaleRepository: OpenseaSalesRepository;
  #tokenZeroRepository: TokenZeroRepository;

  constructor(
    openSeaSaleRepository: OpenseaSalesRepository,
    tokenZeroRepository: TokenZeroRepository
  ) {
    this.#openSeaSaleRepository = openSeaSaleRepository;
    this.#tokenZeroRepository = tokenZeroRepository;
  }

  static saleHasRoyalties(sale: T_OpenSeaSale) {
    // OpenSea's API sometimes labels is_private as null when it appears to be true,
    // so treat null as true for our filter to be accurate.
    if (sale.isPrivate === null) {
      return true;
    }
    return (
      sale.isPrivate === false ||
      (sale.isPrivate &&
        sale.blockNumber >= BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES)
    );
  }

  async getAllSalesBetweenBlockNumbers(
    blockRange: [number, number]
  ): Promise<T_OpenSeaSale[]> {
    const first = 1000;
    let openSeaSales: T_OpenSeaSale[] = [];
    let [blockNumberGte, blockNumberLt] = blockRange;

    while (true) {
      console.log(
        `Fetching last ${first} sales from subgraph for block range: ` +
          `[${blockNumberGte}; ${blockNumberLt}[`
      );
      const newSales =
        await this.#openSeaSaleRepository.getSalesBetweenBlockNumbers(
          { first, skip: 0 },
          blockNumberGte,
          blockNumberLt
        );

      if (newSales.length < first) {
        // found all remaining sales, no scroll required
        openSeaSales.push(...newSales);
        break;
      }

      let blockNumberFinalSale = -1;
      let foundBlockToSplit = false;
      while (!foundBlockToSplit) {
        // We are fetching the sales in desc order by block number
        // Here the last sale will be the one with the lowest block number
        const lastSale = newSales.pop()!;

        // Save the blocknumber of the initial last sale
        if (blockNumberFinalSale === -1) {
          blockNumberFinalSale = lastSale.blockNumber;
          continue;
        }

        // Next query blockNumberLt should be first block found that is different
        // than blockNumberFinalSale. This avoids sliding the query range
        // while being INSIDE a block, which would result in potential missed sales.
        // Add all sales found prior to blockNumberFinalSale.
        if (blockNumberFinalSale < lastSale.blockNumber) {
          // Repush the sale since we popped it
          newSales.push(lastSale);

          // set the higer bound of the range (exclusive) to the last sale
          // block number we just popped
          blockNumberLt = lastSale.blockNumber;

          // Exit the searching loop
          foundBlockToSplit = true;
        }
      }

      openSeaSales.push(...newSales);
    }
    console.log("");

    return openSeaSales;
  }

  /**
   * This function mirrors getAllSalesBetweenBlockNumbers, but uses the OpenSea
   * API instead of subgraph. Still uses subgraph to get token zero of all
   * projects, which are required to enumerate collection slugs on OpenSea,
   * which are required to query sales events.
   */
  async getAllSalesBetweenBlockNumbersOsApi(
    blockRange: [number, number]
  ): Promise<T_OpenSeaSale[]> {
    const first = 1000;
    // the thing we are retuning: openSeaSales array
    let openSeaSales: T_OpenSeaSale[] = [];
    // get token zeros for every project of interest
    let tokenZeros: T_TokenZero[] = [];

    while (true) {
      console.log(`Fetching first ${first} token zeros from subgraph...`);
      const newTokenZeros = await this.#tokenZeroRepository.getAllTokenZeros({
        first,
        skip: 0,
      });

      if (newTokenZeros.length < first) {
        // found all remaining sales, no scroll required
        tokenZeros.push(...newTokenZeros);
        break;
      } else {
        console.error(
          "[ERROR] found >1000 projects, tell devs to add capability to scroll! results invalid."
        );
        throw "Contact devs";
      }
      // warning to devs in future - when adding ability to scroll, keep in mind
      // that TheGraph has an upper limit on skip, so may need to filter in
      // some other way than just using projects() query if future-proofing.
    }
    console.log("");
    // query OpenSea api for every token zero to build array of collection slugs
    // iterate one-by-one to eliminate too-many-calls response from OS API
    // use local cache because this takes a long time due to OS's API.
    const slugsAndTokenZeros: T_SlugAndTokenZero[] = [];
    for (let i = 0; i < tokenZeros.length; i++) {
      const _tokenZero = tokenZeros[i];
      console.debug(
        `[INFO] Getting OS collection slug for: ${_tokenZero.tokens[0].project.name}`
      );
      let collectionSlug = collectionSlugCache.getKey(
        _tokenZero.tokens[0].project.id
      );
      if (collectionSlug !== undefined) {
        console.info(`[INFO] using cached collection slug ${collectionSlug}`);
        slugsAndTokenZeros.push({
          collectionSlug: collectionSlug,
          tokenZero: _tokenZero,
        });
      } else {
        collectionSlug = await getOpenSeaAssetCollectionSlug(
          _tokenZero.tokens[0].contract.id,
          _tokenZero.tokens[0].tokenId.toString()
        );
        slugsAndTokenZeros.push({
          collectionSlug: collectionSlug,
          tokenZero: _tokenZero,
        });
        // add slug to cache, save
        collectionSlugCache.setKey(
          _tokenZero.tokens[0].project.id,
          collectionSlug
        );
        collectionSlugCache.save(true);
      }
    }
    // OS api works in terms of timestamps, not blocks.
    let maxTimestamp = await getBlockTimestamp(blockRange[1]);

    // retrieve all events in timestamp/block range, for each collection
    // populate openSeaSales along the way!
    for (let i = 0; i < slugsAndTokenZeros.length; i++) {
      const _slugAndTokenZero = slugsAndTokenZeros[i];
      console.debug(
        `[INFO] Getting OS sale events for: ${_slugAndTokenZero.collectionSlug}`
      );
      const _newOpenSeaSales = await getOpenSeaSalesEvents(
        _slugAndTokenZero.collectionSlug,
        _slugAndTokenZero.tokenZero,
        maxTimestamp,
        blockRange[0]
      );
      openSeaSales.push(..._newOpenSeaSales);
    }

    return openSeaSales;
  }

  generateProjectReports(
    openSeaSales: T_OpenSeaSale[]
  ): Map<string, ProjectReport> {
    const projectReports = new Map<string, ProjectReport>();

    // Browse all sales
    for (const openSeaSale of openSeaSales) {
      const openSeaSaleLookupTables = openSeaSale.openSeaSaleLookupTables;
      if (openSeaSaleLookupTables.length === 0) {
        console.info("[found open sea sale with length of zero!]");
      }

      // In the pre-filtering stage we might have removed some so we can't
      // get the  number from the openSeaSaleLookupTables list length
      const nbTokensSold = openSeaSale.summaryTokensSold.split("::").length;

      // Browse the list of tokens sold in this sale
      // May be only one in the case of a "Single" sale
      // May be several in the case of a "Bundle" sale
      // In the case of "Bundle" sale only AB tokens are registered by the AB subgraph
      for (const tokenOpenSeaSaleLookupTable of openSeaSaleLookupTables) {
        const token = tokenOpenSeaSaleLookupTable.token;
        const project = token.project;

        // Get/Instanciate the projectReport
        let projectReport = projectReports.get(project.name);
        if (projectReport === undefined) {
          projectReport = new ProjectReport(
            parseInt(project.id),
            project.name,
            project.artistAddress,
            project.additionalPayee,
            project.additionalPayeePercentage
          );
        }

        projectReport.addSale(openSeaSale, nbTokensSold);
        projectReports.set(project.name, projectReport);
      }
    }

    // Once all sales have been processed
    // we can compute the crypto due to artists
    for (const projectName of projectReports.keys()) {
      const projectReport = projectReports.get(projectName)!;
      projectReport.computeCryptoDue();
    }

    return projectReports;
  }
}