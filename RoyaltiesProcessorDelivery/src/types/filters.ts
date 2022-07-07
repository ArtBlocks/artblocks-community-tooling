export type Exchange =
  | 'OS_V1'
  | 'OS_V2'
  | 'OS_Wyvern'
  | 'OS_Seaport'
  | 'OS_All'
  | 'LR_V1'

export type Collection = 'curated' | 'playground' | 'factory'

export type SalesFilter = {
  collectionFilter?: Collection
  contractFilterType?: 'ONLY' | 'ONLY_NOT'
  contractsFilter?: string[]
  exchangeFilter?: Exchange
}
