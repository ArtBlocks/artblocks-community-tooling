export const URL_GRAPHQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/artblocks/art-blocks-with-secondary'
export const REPORTS_FOLDER = './reports'
export const BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES = 13147635
// TheGraph maximum allowed first is 1000 items
export const MAX_ITEMS_PER_SUBGRAPH_QUERY = 1000
// All projects are expected to have a combined artist + additional payee
// royalty of 5%. If not, user will be warned, and OpenSea may not be handling
export const EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE = 5
export const AB_FLAGSHIP_CONTRACTS = [
  '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270'.toLowerCase(),
  '0x059EDD72Cd353dF5106D2B9cC5ab83a52287aC3a'.toLowerCase(),
]
