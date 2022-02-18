export const URL_GRAPHQL_ENDPOINT =
  "https://api.thegraph.com/subgraphs/name/artblocks/art-blocks-with-secondary";
export const REPORTS_FOLDER = "./reports";
export const BLOCK_WHERE_PRIVATE_SALES_HAVE_ROYALTIES = 13147635;
// TheGraph maximum allowed first is 1000 items
export const MAX_ITEMS_PER_SUBGRAPH_QUERY = 1000;
// All projects are expected to have a combined artist + additional payee
// royalty of 5%. If not, user will be warned, and OpenSea may not be handling
export const EXPECTED_ARTIST_TOTAL_ROYALTY_PERCENTAGE = 5;
