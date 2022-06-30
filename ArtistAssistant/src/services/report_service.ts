import { BigNumber } from '@ethersproject/bignumber'
import { writeFileSync } from 'fs'
import path from 'path'
import {
  REPORTS_FOLDER,
  BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES,
  EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE,
} from '../constants'
import { ProjectReport } from './project_service'
import {
  addressToPaymentToken,
  amountHumanReadable,
} from '../utils/token_conversion'

export class ReportService {
  #csvSeparator: string

  constructor() {
    this.#csvSeparator = process.env.CSV_SEPARATOR || ','
  }

  generateCsvOutputFilePath(
    projectName: string,
    startingBlock: number,
    endingBlock: number
  ): string {
    return path.join(
      REPORTS_FOLDER,
      `${projectName.toLowerCase().trim().replace(' ', '-')}_` +
        `${startingBlock}_${endingBlock}.csv`
    )
  }

  generateCSV(projectReport: ProjectReport, csvOutputFilePath: string): void {
    const sep = this.#csvSeparator

    let csvHeader = `Project:${sep}${projectReport.name}\n`
    csvHeader += `Artist address:${sep}${projectReport.artistAddress}\n`
    csvHeader += `Additonal address:${sep}${
      projectReport.additionalPayeeAddress || 'none'
    }\n`
    csvHeader += `To additional address:${sep}${
      projectReport.additionalPayeePercentage || '0'
    }%\n`
    csvHeader += `From block:${sep}${projectReport.blockRange[0]}\n`
    csvHeader += `To block:${sep}${projectReport.blockRange[1]}\n`
    csvHeader += `Private sales royalties block:${sep} ${BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES}\n`
    csvHeader += '\n'

    // warn user if different royalty percentage than expected
    // warn if royaltyPercentage from contract is NOT expected value of 5(%)
    if (
      projectReport.royaltyPercentage !==
      EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE
    ) {
      csvHeader +=
        `[WARN] Current artist+secondary royalty percentage is ` +
        `NOT ${EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE}%, current ` +
        `contract value: ${projectReport.royaltyPercentage} percent\n`
      csvHeader +=
        `[WARN] Please ensure OpenSea is handling something other than ` +
        `${EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE}% appropriately (they ` +
        `probably are NOT handling this correctly and might default to 5%)\n`
      csvHeader += '\n'
    }

    // report assumptions
    csvHeader +=
      `Calculations assume constant royalty percentage of ` +
      `${projectReport.royaltyPercentage}% to combined (artist+additional)\n`
    csvHeader +=
      `Calculations assume constant additional payee percentage of ` +
      `${projectReport.additionalPayeePercentage || 0}% to address ` +
      `${projectReport.additionalPayeeAddress}\n`
    csvHeader +=
      'If percentages or secondary percentages or addresses changed in the ' +
      'block range analyzed those changes ARE NOT captured in this analysis\n'
    csvHeader += '\n'

    csvHeader += `Total number of sales: ${sep} ${projectReport.sales.length}\n`
    csvHeader += `Number of private sales:${sep} ${
      projectReport.sales.filter((s) => s.openSeaSale.isPrivate).length
    }\n`
    csvHeader += '\n\n'

    for (const [
      paymentToken,
      paymentsRepartition,
    ] of projectReport.paymentsByPaymentTokens.entries()) {
      const paymentTokenSymbol = addressToPaymentToken(paymentToken)

      const saleVolumeForPaymentToken =
        projectReport.saleVolumeByPaymentTokens.get(paymentToken)!

      const readableSaleVolume = amountHumanReadable(
        paymentTokenSymbol,
        saleVolumeForPaymentToken
      )
      const readableProjectPayment = amountHumanReadable(
        paymentTokenSymbol,
        paymentsRepartition.project
      )
      const readableArtistPayment = amountHumanReadable(
        paymentTokenSymbol,
        paymentsRepartition.artist
      )
      const readableAdditionalPayment = amountHumanReadable(
        paymentTokenSymbol,
        paymentsRepartition.additional
      )

      csvHeader += `Total ${paymentTokenSymbol} sale volume:${sep}${readableSaleVolume}\n`
      csvHeader += `Total ${paymentTokenSymbol} to project:${sep}${readableProjectPayment}\n`
      csvHeader += `Total ${paymentTokenSymbol} to artist:${sep}${readableArtistPayment}\n`
      csvHeader += `Total ${paymentTokenSymbol} to additional:${sep}${readableAdditionalPayment}\n`
      csvHeader += '\n'
    }

    let csvContentTitles = `Timestamp${sep}Date${sep}Block number${sep}Transaction${sep}Sale type${sep}Private sale${sep}`
    csvContentTitles += `Seller${sep}Buyer${sep}Token(s)${sep}Payment token address${sep}Payment token symbol${sep}`
    csvContentTitles += `Sale price${sep}Royalties to project${sep}Royalties to artist${sep}Royalties to additional\n`

    let csvContentData = ''

    for (const detailedSale of projectReport.sales) {
      // Timestamp
      csvContentData += `${detailedSale.openSeaSale.blockTimestamp}${sep}`
      // Date
      const date = new Date(
        parseInt(detailedSale.openSeaSale.blockTimestamp) * 1000
      )
      csvContentData += `${date.toLocaleString().replaceAll(', ', '-')}${sep}`
      // Block number
      csvContentData += `${detailedSale.openSeaSale.blockNumber}${sep}`
      // Transaction
      csvContentData += `${detailedSale.openSeaSale.id}${sep}`
      // Sale type
      csvContentData += `${detailedSale.openSeaSale.saleType}${sep}`
      // Private sale
      csvContentData += `${detailedSale.openSeaSale.isPrivate}${sep}`
      // Seller
      csvContentData += `${detailedSale.openSeaSale.seller}${sep}`
      // Buyer
      csvContentData += `${detailedSale.openSeaSale.buyer}${sep}`
      // Tokens
      const tokens = detailedSale.openSeaSale.summaryTokensSold
        .split('-')
        .filter((chunk) => !chunk.startsWith('0x'))
        .join()
        .replaceAll('::', '\n')
      csvContentData += `"${tokens}"${sep}`
      // Payment token address
      csvContentData += `${detailedSale.openSeaSale.paymentToken}${sep}`
      // Payment token symbol
      const paymentTokenSymbol = addressToPaymentToken(
        detailedSale.openSeaSale.paymentToken
      )
      csvContentData += `${paymentTokenSymbol}${sep}`
      // Price
      const price = amountHumanReadable(
        paymentTokenSymbol,
        BigNumber.from(detailedSale.openSeaSale.price)
      )
      csvContentData += `${price}${sep}`

      if (ProjectReport.saleHasRoyalties(detailedSale.openSeaSale)) {
        // Royalties to project
        const royaltiesToProject = amountHumanReadable(
          paymentTokenSymbol,
          detailedSale.paymentAttributedToProject
        )
        csvContentData += `${royaltiesToProject}${sep}`
        // Royalties to artist
        const royaltiesToArtist = amountHumanReadable(
          paymentTokenSymbol,
          detailedSale.paymentToArtist
        )
        csvContentData += `${royaltiesToArtist}${sep}`
        // Royalties to additional
        const royaltiesToAdditional = amountHumanReadable(
          paymentTokenSymbol,
          detailedSale.paymentToAdditional
        )
        csvContentData += `${royaltiesToAdditional}\n`
      } else {
        // Royalties to project
        csvContentData += `No royalties for this private sale${sep}`
        // Royalties to artist
        csvContentData += `No royalties for this private sale${sep}`
        // Royalties to additional
        csvContentData += `No royalties for this private sale\n`
      }
    }

    let csvTxt = csvHeader
    csvTxt += '\n\n'
    csvTxt += csvContentTitles + csvContentData

    writeFileSync(csvOutputFilePath, csvTxt)
    console.log(`Report written to CSV ${csvOutputFilePath}`)
  }

  reportToConsole(projectReport: ProjectReport): void {
    console.log(`Project: ${projectReport.name}`)
    console.log(`Artist address: ${projectReport.artistAddress}`)
    console.log(
      `Additonal address: ${projectReport.additionalPayeeAddress || 'none'}`
    )
    console.log(
      `To additional address: ${
        projectReport.additionalPayeePercentage || '0'
      }%`
    )
    console.log(`From block: ${projectReport.blockRange[0]}`)
    console.log(`To block: ${projectReport.blockRange[1]}`)
    console.log(
      `Private sales royalties included after block: ${BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES}`
    )
    console.log('\n')

    // warn if royaltyPercentage from contract is NOT expected value of 5(%)
    if (
      projectReport.royaltyPercentage !==
      EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE
    ) {
      console.warn(
        `[WARN] Current artist+secondary royalty percentage is ` +
          `NOT ${EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE}%, current ` +
          `contract value: ${projectReport.royaltyPercentage} percent`
      )
      console.warn(
        `[WARN] Please ensure OpenSea is handling something other than ` +
          `${EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE}% appropriately (they ` +
          `probably are NOT handling this correctly and might default to 5%)`
      )
      console.log('\n')
    }

    // report assumptions
    console.log(
      `Calculations assume constant royalty percentage of ` +
        `${projectReport.royaltyPercentage}% to combined (artist+additional)`
    )
    console.log(
      `Calculations assume constant additional payee percentage of ` +
        `${projectReport.additionalPayeePercentage || 0}% to address ` +
        `${projectReport.additionalPayeeAddress}`
    )
    console.log(
      'If percentages, secondary percentages, or addresses changed in the ' +
        'block range analyzed, those changes ARE NOT captured in this analysis!'
    )
    console.log('\n')

    console.log(`Total number of sales:  ${projectReport.sales.length}`)
    console.log(
      `Number of private sales: ${
        projectReport.sales.filter((s) => s.openSeaSale.isPrivate).length
      }`
    )
    console.log('\n')

    for (const [
      paymentToken,
      paymentsRepartition,
    ] of projectReport.paymentsByPaymentTokens.entries()) {
      const paymentTokenSymbol = addressToPaymentToken(paymentToken)
      const saleVolumeForPaymentToken =
        projectReport.saleVolumeByPaymentTokens.get(paymentToken)!

      const readableSaleVolume = amountHumanReadable(
        paymentTokenSymbol,
        saleVolumeForPaymentToken
      )
      const readableProjectPayment = amountHumanReadable(
        paymentTokenSymbol,
        paymentsRepartition.project
      )
      const readableArtistPayment = amountHumanReadable(
        paymentTokenSymbol,
        paymentsRepartition.artist
      )
      const readableAdditionalPayment = amountHumanReadable(
        paymentTokenSymbol,
        paymentsRepartition.additional
      )

      console.log(
        `Total ${paymentTokenSymbol} sale volume: ${readableSaleVolume}`
      )
      console.log(
        `Total ${paymentTokenSymbol} to project: ${readableProjectPayment}`
      )
      console.log(
        `Total ${paymentTokenSymbol} to artist: ${readableArtistPayment}`
      )
      console.log(
        `Total ${paymentTokenSymbol} to additional: ${readableAdditionalPayment}`
      )
      console.log('\n')
    }
  }
}
