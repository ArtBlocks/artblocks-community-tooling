import { BigNumber } from "ethers";
import { writeFileSync } from "fs";

import { ProjectReport } from "../types/project_report";
import {
  amountHumanReadable,
  ART_BLOCKS_PAYMENT_TOKENS,
} from "../utils/token_conversion";

const PBAB_ROYALTY_DENOMINATOR = BigNumber.from(1 / 0.025);

export class ReportService {
  #csvSeparator: string;

  constructor() {
    this.#csvSeparator = process.env.CSV_SEPARATOR || ",";
  }

  outputReportToConsole(
    blockRange: [number, number],
    projectReports: ProjectReport[]
  ) {
    let as_str = `Run with block range [${blockRange[0]}; ${blockRange[1]}[\n`;

    projectReports.sort((a, b) => a.projectId - b.projectId);
    for (const projectReport of projectReports) {
      as_str += this._projectReportToString(projectReport);
    }

    console.log(as_str);
  }

  private _projectReportToString(projectReport: ProjectReport): string {
    const {
      name,
      totalSales,
      artistAddress,
      additionalPayeeAddress,
      paymentTokenVolumes,
      cryptoDue,
    } = projectReport;

    let as_str = `${name}\n`;
    as_str += `\tArtist address: ${artistAddress}\n`;
    if (additionalPayeeAddress !== null) {
      as_str += `\tAdditional payee address: ${additionalPayeeAddress}\n`;
    }
    as_str += `\tTotal sales made: ${totalSales}\n\n`;

    const cryptos = Array.from(cryptoDue.keys()).sort();

    for (const crypto of cryptos) {
      const volume = paymentTokenVolumes.get(crypto)!;
      const amountReadable = amountHumanReadable(crypto, volume.total);

      as_str += `\t\t- ${crypto}\n`;
      as_str += `\t\t\t- Total amount ${amountReadable} ${crypto}\n`;

      const { toArtist, toAdditional } = cryptoDue.get(crypto)!;
      const amountToArtistReadable = amountHumanReadable(crypto, toArtist);

      as_str += `\t\t\t- To send to ${artistAddress} : ${amountToArtistReadable} ${crypto}\n`;
      if (toAdditional !== 0) {
        const amountToAdditionalPayeeReadable = amountHumanReadable(
          crypto,
          toAdditional
        );
        as_str += `\t\t\t- To send to ${additionalPayeeAddress} : ${amountToAdditionalPayeeReadable} ${crypto}\n`;
      }
    }

    as_str +=
      "----------------------------------------------------------------------------------------------------------\n";

    return as_str;
  }

  getDateHeader(): string {
    const sep = this.#csvSeparator;
    const ts = Date.now();
    let dateTime = new Date(ts);
    return `Report Generated:${sep}${dateTime.getFullYear()}-${dateTime.getMonth() + 1
      }-${dateTime.getDate()}\n`;
  }

  getBlocksHeader(
    blockRange: [number, number],
    addSpaceAfterHeader: boolean = true
  ): string {
    const sep = this.#csvSeparator;
    const reportBlockRangeHeader = `Lower bound block (included)${sep}Higher bound block (excluded)\n`;
    const reportBlockRangeData = `${blockRange[0]}${sep}${blockRange[1]}\n`;
    const spaceAfterHeader = addSpaceAfterHeader
      ? `${sep}\n${sep}\n${sep}\n`
      : "";
    return reportBlockRangeHeader + reportBlockRangeData + spaceAfterHeader;
  }

  generateCSVFromProjectReports(
    blockRange: [number, number],
    projectReports: ProjectReport[],
    csvOutputFilePath: string
  ): void {
    const sep = this.#csvSeparator;
    const blocksHeader = this.getBlocksHeader(blockRange);

    // Build the global CSV header
    let projectReportHeader = `ADDRESS TO PAY`;
    for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
      projectReportHeader += `${sep}${crypto} TO BE PAID`;
    }

    let csvData = blocksHeader + projectReportHeader + "\n";

    projectReports.sort((a, b) => a.projectId - b.projectId);
    // get csv formatted data and write to file
    csvData += this._projectReportsToCSV(projectReports);
    writeFileSync(csvOutputFilePath, csvData);
    console.log(`Results written to ${csvOutputFilePath}`);
  }

  private _projectReportsToCSV(projectReports: ProjectReport[]): string {
    const sep = this.#csvSeparator;
    // mapping of address to object of crypto symbol to amount to be paid
    const addrToAmountDue = new Map();
    const _emptyObj = {};
    for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
      _emptyObj[crypto] = BigNumber.from(0);
    }
    for (const projectReport of projectReports) {
      const { artistAddress, additionalPayeeAddress, cryptoDue } =
        projectReport;
      // initialize artist/additional keys if required
      if (addrToAmountDue.get(artistAddress) === undefined) {
        addrToAmountDue.set(artistAddress, { ..._emptyObj });
      }
      if (
        additionalPayeeAddress !== null &&
        addrToAmountDue.get(additionalPayeeAddress) === undefined
      ) {
        addrToAmountDue.set(additionalPayeeAddress, { ..._emptyObj });
      }
      const artistTotalsDue = addrToAmountDue.get(artistAddress);
      const additionalTotalsDue =
        additionalPayeeAddress === null
          ? null
          : addrToAmountDue.get(additionalPayeeAddress);
      // add amount due in each currency to artist and additional payee
      for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
        const thisCryptoDue = cryptoDue.get(crypto);
        const thisCryptoDueToArtist = thisCryptoDue?.toArtist;
        const thisCryptoDueToAdditional = thisCryptoDue?.toAdditional;
        if (thisCryptoDueToArtist) {
          artistTotalsDue[crypto] = artistTotalsDue[crypto].add(
            thisCryptoDueToArtist
          );
        }
        if (thisCryptoDueToAdditional) {
          if (additionalPayeeAddress === null) {
            throw "Additional payee address is null, but crypto is due. please report this error to developer.";
          }
          additionalTotalsDue[crypto] = additionalTotalsDue[crypto].add(
            thisCryptoDueToAdditional
          );
        }
      }
    }
    // generate csv report, one key per address in addrToAmountDue
    let reportData = "";
    // regex that returns true if string is non-zero
    const nonZeroRegExp = new RegExp(
      "^(0*[1-9][0-9]*(.[0-9]+)?|0+.[0-9]*[1-9][0-9]*)$"
    );
    addrToAmountDue.forEach((_val, _key) => {
      // skip address if zero is owed (within printed csv precision)
      const isOwed = ART_BLOCKS_PAYMENT_TOKENS.some((crypto) => {
        return nonZeroRegExp.test(amountHumanReadable(crypto, _val[crypto]));
      });
      if (isOwed) {
        reportData += `${_key}`;
        // Loop for all possible payment token listed by Art Blocks
        for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
          // If no sales was made with this payment token, still record it with a 0
          const amount = _val[crypto];
          const amountReadable =
            amount == 0 ? "0.000" : amountHumanReadable(crypto, amount);
          reportData += `${sep}${amountReadable}`;
        }
        reportData += "\n";
      }
    });
    return reportData;
  }

  generateDetailedCSVFromProjectReports(
    blockRange: [number, number],
    projectReports: ProjectReport[],
    csvOutputFilePath: string
  ): void {
    const sep = this.#csvSeparator;
    const blocksHeader = this.getBlocksHeader(blockRange);

    // Build the global CSV header
    let projectReportHeader = `PROJECT NAME${sep}TOTAL SALES${sep}ARTIST ADDRESS${sep}ADDITIONAL ADDRESS`;
    for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
      projectReportHeader += `${sep}OS_V1 ${crypto} VOLUME${sep}OS_V2 ${crypto} VOLUME${sep}LR_V1 ${crypto} VOLUME${sep}TOTAL ${crypto} VOLUME${sep}${crypto} FOR ARTIST${sep}${crypto} FOR ADDITIONAL`;
    }

    let csvData = blocksHeader + projectReportHeader + "\n";

    projectReports.sort((a, b) => a.projectId - b.projectId);
    for (const projectReport of projectReports) {
      const formatedReportData =
        this._projectReportToDetailedCSV(projectReport);
      csvData += formatedReportData;
    }
    console.log(`Detailed results written to ${csvOutputFilePath}`);
    writeFileSync(csvOutputFilePath, csvData);
  }

  generatePBABInvoiceCSVFromProjectReports(
    blockRange: [number, number],
    projectReports: ProjectReport[],
    csvOutputFilePath: string,
    coreContract: string
  ): void {
    const sep = this.#csvSeparator;
    // Disclaimers
    const disclaimers =
      "Disclaimer: Values in this report represent our best estimate of OpenSea and LooksRare on-chain activity but no guarantee of accuracy is included. Report numbers were not produced by OpenSea or LooksRare and are subject to change as OpenSea's and LooksRare's royalty collection processes change.\n" +
      "Disclaimer: Informational-only Artist and Additional Payee percentages are assumed to not change through time and are assumed to total 5% (hard-coded - does not account for any on-chain updated values).\n\n";

    // date header
    const dateHeader = this.getDateHeader();

    // block header
    const blocksHeader = this.getBlocksHeader(blockRange, false);

    // pbab invoice totals
    let pbabInvoiceHeaderLineA = `Core Contract:${sep}${coreContract}${sep}`;
    let pbabInvoiceHeaderLineB = `PBAB Invoice (2.5% of total volume):${sep}${sep}`;
    for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
      pbabInvoiceHeaderLineA += `${sep}${sep}${sep}${sep}${sep}${crypto}${sep}`;
      let _cryptoVolume = BigNumber.from(0);
      for (const projectReport of projectReports) {
        const _volume = projectReport.paymentTokenVolumes.get(crypto);
        if (_volume !== undefined) {
          _cryptoVolume = _cryptoVolume.add(_volume.total);
        }
      }
      const invoiceForCurrency = _cryptoVolume.div(PBAB_ROYALTY_DENOMINATOR);
      pbabInvoiceHeaderLineB += `${sep}${sep}${sep}${sep}${sep}${amountHumanReadable(
        crypto,
        invoiceForCurrency
      )}${sep}`;
    }

    // Build the global CSV header
    let projectReportHeader = `PROJECT NAME${sep}TOTAL SALES${sep}ARTIST ADDRESS${sep}ADDITIONAL ADDRESS`;
    for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
      projectReportHeader += `${sep}OS_V1 ${crypto} VOLUME${sep}OS_V2 ${crypto} VOLUME${sep}LR_V1 ${crypto} VOLUME${sep}TOTAL ${crypto} VOLUME${sep}${crypto} FOR ARTIST${sep}${crypto} FOR ADDITIONAL`;
    }

    let csvData =
      disclaimers +
      dateHeader +
      blocksHeader +
      pbabInvoiceHeaderLineA +
      "\n" +
      pbabInvoiceHeaderLineB +
      "\n" +
      projectReportHeader +
      "\n";

    projectReports.sort((a, b) => a.projectId - b.projectId);
    for (const projectReport of projectReports) {
      const formatedReportData =
        this._projectReportToDetailedCSV(projectReport);
      csvData += formatedReportData;
    }
    console.log(`Detailed results written to ${csvOutputFilePath}`);
    writeFileSync(csvOutputFilePath, csvData);
  }

  private _projectReportToDetailedCSV(projectReport: ProjectReport): string {
    const sep = this.#csvSeparator;
    const {
      name,
      totalSales,
      artistAddress,
      additionalPayeeAddress,
      paymentTokenVolumes,
      cryptoDue,
    } = projectReport;
    const escapedProjectName = name.replace(sep, "");

    let projectReportData = `${escapedProjectName}${sep}${totalSales}${sep}${artistAddress}${sep}${additionalPayeeAddress === undefined ? "None" : additionalPayeeAddress
      }`;

    // Loop for all possible payment token listed by Art Blocks
    for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
      const volume = paymentTokenVolumes.get(crypto);

      // If no sales was made with this payment token, record it with a 0
      let osV1VolumeReadable = "0.00000";
      let osV2VolumeReadable = "0.00000";
      let looksRareVolumeReadable = "0.00000";
      let totalVolumeReadable = "0.00000";
      let amountToArtistReadable = "0.00000";
      let amountToAdditionalPayeeReadable = "0.00000";

      // Else fetch the amounts
      if (volume !== undefined) {
        const { toArtist, toAdditional } = cryptoDue.get(crypto)!;
        osV1VolumeReadable = amountHumanReadable(crypto, volume["OS_V1"]);
        osV2VolumeReadable = amountHumanReadable(crypto, volume["OS_V2"]);
        looksRareVolumeReadable = amountHumanReadable(crypto, volume['LR_V1']);
        totalVolumeReadable = amountHumanReadable(crypto, volume.total);
        amountToArtistReadable = amountHumanReadable(crypto, toArtist);
        amountToAdditionalPayeeReadable =
          toAdditional !== 0
            ? amountHumanReadable(crypto, toAdditional)
            : "0.00000";
      }

      projectReportData += `${sep}${osV1VolumeReadable}${sep}${osV2VolumeReadable}${sep}${looksRareVolumeReadable}${sep}${totalVolumeReadable}${sep}${amountToArtistReadable}${sep}${amountToAdditionalPayeeReadable}`;
    }

    return projectReportData + "\n";
  }

  generateRawCSVFromProjectReports(
    blockRange: [number, number],
    projectReports: ProjectReport[],
    csvOutputFilePath: string
  ): void {
    const sep = this.#csvSeparator;

    let projectReportHeader = `amount${sep}address${sep}memo${sep}token`;
    let csvData = projectReportHeader + "\n";

    projectReports.sort((a, b) => a.projectId - b.projectId);
    for (const projectReport of projectReports) {
      const formatedReportData = this._projectReportToRawCSV(
        projectReport,
        blockRange
      );
      csvData += formatedReportData;
    }
    console.log(`Raw results written to ${csvOutputFilePath}`);
    writeFileSync(csvOutputFilePath, csvData);
  }

  private _projectReportToRawCSV(
    projectReport: ProjectReport,
    blockRange: [number, number]
  ): string {
    const sep = this.#csvSeparator;
    const {
      artistAddress,
      additionalPayeeAddress,
      paymentTokenVolumes,
      cryptoDue,
    } = projectReport;

    let projectReportData = "";

    // Loop for all possible payment token listed by Art Blocks
    for (const crypto of ART_BLOCKS_PAYMENT_TOKENS) {
      const amount = paymentTokenVolumes.get(crypto);

      // If no sales was made with this payment token, do not add line
      if (amount === undefined) {
        continue;
      }

      const { toArtist, toAdditional } = cryptoDue.get(crypto)!;
      const memo = `${projectReport.name} Sold on OpenSea and LooksRare between blocks ${blockRange[0]} and ${blockRange[1]}`;

      // Only add the line for the artist if amount perceived is > 0
      if (toArtist.gt(0)) {
        const amountToArtistReadable = amountHumanReadable(crypto, toArtist);
        projectReportData += `${amountToArtistReadable}${sep}${artistAddress}${sep}${memo}${sep}${crypto}\n`;
      }

      // Only add the additional payee if the amount perceived is not 0
      if (
        additionalPayeeAddress !== null &&
        toAdditional !== 0 &&
        toAdditional.gt(0)
      ) {
        const amountToAdditionalPayeeReadable = amountHumanReadable(
          crypto,
          toAdditional
        );
        projectReportData += `${amountToAdditionalPayeeReadable}${sep}${additionalPayeeAddress}${sep}${memo}${sep}${crypto}\n`;
      }
    }

    return projectReportData;
  }
}
