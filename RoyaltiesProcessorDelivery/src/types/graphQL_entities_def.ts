type T_Project = {
  id: string
  name: string
  artistAddress: string
  curationStatus: 'curated' | 'playground' | 'factory'
  additionalPayee: string | null
  additionalPayeePercentage: number | null
}

type T_Contract = {
  id: string
}

export type T_Token = {
  id: string
  tokenId: number
  contract: T_Contract
  project: T_Project
}

export type T_SaleLookupTable = {
  id: string
  token: T_Token
  //sale: T_Sale;
}

export type T_Payment = {
  id: string
  paymentType: 'Native' | 'ERC20' | 'ERC721' | 'ERC1155'
  paymentToken: string
  price: string
  sale: T_Sale
  recipient: string
}

export type T_Sale = {
  id: string
  exchange: 'OS_V1' | 'OS_V2' | 'LR_V1' | 'OS_Vunknown' | 'OS_SP'
  saleType: 'Single' | 'Bundle'
  blockNumber: number
  blockTimestamp: string
  seller: string
  buyer: string
  payments: T_Payment[]
  isPrivate: boolean
  summaryTokensSold: string
  saleLookupTables: T_SaleLookupTable[]
}

export type T_TokenZero = {
  id: string // subgraph's Project entity id for this TokenZero
  curationStatus: string
  tokens: T_Token[]
}
