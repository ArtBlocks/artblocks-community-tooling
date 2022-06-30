import { BigNumber } from 'ethers'
import {
  T_OpenSeaSales,
  T_OpenSeaSale,
  T_CurrentProjectData,
} from '../types/graphQL_entities_def'
import { BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES } from '../constants'
import { ETH_ADDR, WETH_ADDR } from '../utils/token_conversion'

type T_PaymentsRepartition = {
  project: BigNumber
  artist: BigNumber
  additional: BigNumber
}

type T_DetailedSale = {
  openSeaSale: T_OpenSeaSale
  flag: 'trusted' | 'danger'
  paymentAttributedToProject: BigNumber
  paymentToArtist: BigNumber
  paymentToAdditional: BigNumber
}

/**
 * An instance of this class contains data for a project.
 * Sales (currently OpenSea sales T_OpenSeaSales) may be added to an
 * instance in bulk.
 * The object may then be passed to an instance of a ReportService
 * to generate summarized outputs of seoncary sales royalty data.
 */
export class ProjectReport {
  contractAddr: string
  projectId: number
  name: string
  royaltyPercentage: number
  artistAddress: string
  additionalPayeeAddress: string | null
  additionalPayeePercentage: number | null
  blockRange: [number, number]
  sales: T_DetailedSale[]
  saleVolumeByPaymentTokens: Map<String, BigNumber>
  paymentsByPaymentTokens: Map<string, T_PaymentsRepartition>

  constructor(
    contractAddr: string,
    projectNumber: number,
    currentProjectData: T_CurrentProjectData,
    blockRange: [number, number]
  ) {
    this.contractAddr = contractAddr
    this.projectId = projectNumber
    this.name = currentProjectData.name
    this.royaltyPercentage = parseFloat(currentProjectData.royaltyPercentage)
    this.artistAddress = currentProjectData.artistAddress
    this.additionalPayeeAddress = currentProjectData.additionalPayee
    this.additionalPayeePercentage =
      currentProjectData.additionalPayeePercentage === null
        ? null
        : parseFloat(currentProjectData.additionalPayeePercentage)
    this.blockRange = blockRange
    // initialize empty structures
    this.sales = []
    this.paymentsByPaymentTokens = new Map()
    this.saleVolumeByPaymentTokens = new Map()
  }

  addOpenSeaSales(openSeaSales: T_OpenSeaSales): void {
    // populate with OpenSea sales
    for (const _key of Object.keys(openSeaSales)) {
      const sale = openSeaSales[_key]
      const nbTokensSold = sale.summaryTokensSold.split('::').length

      // The total royalties taken from the sale
      const totalPayment = BigNumber.from(sale.price).mul(5).div(100)

      // The part of the royalties owned by the project (total royalties / numer of token sold in the sale)
      const paymentToProject = totalPayment.div(nbTokensSold)

      const paymentToAdditional =
        this.additionalPayeePercentage === null
          ? BigNumber.from(0)
          : paymentToProject.mul(this.additionalPayeePercentage).div(100)
      const paymentToArtist = paymentToProject.sub(paymentToAdditional)

      // For consistency check if the sale is private witout royalties and if so reset the payments to 0
      const saleHasRoyalties = ProjectReport.saleHasRoyalties(sale)

      this.addOpenSeaSale(
        sale,
        'trusted',
        saleHasRoyalties ? paymentToProject : BigNumber.from(0),
        saleHasRoyalties ? paymentToArtist : BigNumber.from(0),
        saleHasRoyalties ? paymentToAdditional : BigNumber.from(0)
      )
    }
  }

  addOpenSeaSale(
    sale: T_OpenSeaSale,
    flag: 'trusted' | 'danger',
    paymentToProject: BigNumber,
    paymentToArtist: BigNumber,
    paymentToAdditional: BigNumber
  ): void {
    // In all case add the sale to the history
    this.sales.push({
      openSeaSale: sale,
      flag,
      paymentAttributedToProject: paymentToProject,
      paymentToArtist,
      paymentToAdditional,
    })

    let paymentToken = sale.paymentToken

    // Update the total sale volumes by payment tokens
    const totalSaleVolumeForPaymentToken =
      this.saleVolumeByPaymentTokens.get(paymentToken)
    if (totalSaleVolumeForPaymentToken === undefined) {
      this.saleVolumeByPaymentTokens.set(
        paymentToken,
        BigNumber.from(sale.price)
      )
    } else {
      this.saleVolumeByPaymentTokens.set(
        paymentToken,
        totalSaleVolumeForPaymentToken.add(BigNumber.from(sale.price))
      )
    }

    // Now only if the sale should be taken into account in royalties update the volume
    if (ProjectReport.saleHasRoyalties(sale)) {
      const paymentsForPaymentToken =
        this.paymentsByPaymentTokens.get(paymentToken)

      if (paymentsForPaymentToken !== undefined) {
        paymentsForPaymentToken.project =
          paymentsForPaymentToken.project.add(paymentToProject)
        paymentsForPaymentToken.artist =
          paymentsForPaymentToken.artist.add(paymentToArtist)
        paymentsForPaymentToken.additional =
          paymentsForPaymentToken.additional.add(paymentToAdditional)
      } else {
        const payments: T_PaymentsRepartition = {
          project: paymentToProject,
          artist: paymentToArtist,
          additional: paymentToAdditional,
        }
        this.paymentsByPaymentTokens.set(paymentToken, payments)
      }
    }
  }

  static saleHasRoyalties(sale: T_OpenSeaSale) {
    return (
      sale.isPrivate === false ||
      (sale.isPrivate &&
        sale.blockNumber >= BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES)
    )
  }
}
