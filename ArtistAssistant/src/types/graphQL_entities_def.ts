export type T_OpenSeaSale = {
  id: string
  saleType: 'Single' | 'Bundle'
  blockNumber: number
  blockTimestamp: string
  summaryTokensSold: string
  seller: string
  buyer: string
  paymentToken: string
  price: string
  isPrivate: boolean
}

export type T_OpenSeaSales = {
  timestamp_txhash?: T_OpenSeaSale
}

export type T_CurrentProjectData = {
  name: string
  additionalPayee: string | null
  additionalPayeePercentage: string | null
  artistAddress: string
  royaltyPercentage: string
}
