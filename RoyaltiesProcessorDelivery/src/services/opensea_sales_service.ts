import { BigNumber } from "ethers";
import {
  BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES,
} from "../constant";

import { OpenseaSalesRepository } from "../repositories/opensea_sales_repository";
import { T_OpenSeaSale } from "../types/graphQL_entities_def";
import { ProjectReport } from "../types/project_report";

export class OpenSeaSalesService {
  #openSeaSaleRepository: OpenseaSalesRepository;

  constructor(openSeaSaleRepository: OpenseaSalesRepository) {
    this.#openSeaSaleRepository = openSeaSaleRepository;
  }

  static saleHasRoyalties(sale: T_OpenSeaSale) {
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

  generateProjectReports(
    openSeaSales: T_OpenSeaSale[],
  ): Map<string, ProjectReport> {
    const projectReports = new Map<string, ProjectReport>();

    // Browse all sales
    for (const openSeaSale of openSeaSales) {
      const openSeaSaleLookupTables = openSeaSale.openSeaSaleLookupTables;

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

        // Add the sale to the report
        // The price is divided between the number of tokens in the sale
        // TODO!: The subgraph only register AB tokens in for Bundle. If the bundle contains other NFTs
        //!       the price will not be split correctly (i.e only split in 2 whereas there are 5
        //!       NFTs sold in the bundle)
        //!       But this edges case is extremely rare
        //!       (This is noted as an assumption in readme)
        const priceAttributedToProject = BigNumber.from(openSeaSale.price).div(nbTokensSold);
        const paymentToken = openSeaSale.paymentToken;

        projectReport.addSale(paymentToken, priceAttributedToProject);
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