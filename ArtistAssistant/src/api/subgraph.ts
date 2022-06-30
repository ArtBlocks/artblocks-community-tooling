import { GraphQLClient, gql } from 'graphql-request'
import {
  T_OpenSeaSales,
  T_CurrentProjectData,
} from '../types/graphQL_entities_def'
import {
  URL_GRAPHQL_ENDPOINT,
  MAX_ITEMS_PER_SUBGRAPH_QUERY,
} from '../constants'

const client = new GraphQLClient(URL_GRAPHQL_ENDPOINT)

const QueryCurrentProjectData = gql`
  query getCurrentProjectData($contractId: ID!, $projectId: Int!) {
    contract(id: $contractId) {
      projects(where: { projectId: $projectId }) {
        name
        artistAddress
        additionalPayee
        additionalPayeePercentage
        royaltyPercentage
      }
    }
  }
`

const QueryProjectSales = gql`
  query getProjectSales(
    $contractId: ID!
    $projectId: Int!
    $blockNumberStart: Int!
    $blockNumberLessThan: Int!
    $firstSales: Int!
  ) {
    contract(id: $contractId) {
      projects(where: { projectId: $projectId }) {
        openSeaSaleLookupTables(
          first: $firstSales
          orderBy: timestamp
          where: {
            blockNumber_gte: $blockNumberStart
            blockNumber_lt: $blockNumberLessThan
          }
        ) {
          openSeaSale {
            id
            saleType
            blockNumber
            blockTimestamp
            summaryTokensSold
            seller
            buyer
            paymentToken
            price
            isPrivate
          }
        }
      }
    }
  }
`

export const getCurrentProjectData = async (
  contractAddr: string,
  projectNumber: number
): Promise<T_CurrentProjectData> => {
  const results = await client.request(QueryCurrentProjectData, {
    contractId: contractAddr,
    projectId: projectNumber,
  })
  return results.contract.projects[0]
}

export const getOpenSeaSalesProjectBlockRange = async (
  contractAddr: string,
  projectNumber: number,
  blockNumberStart: number,
  blockNumberEnd: number
): Promise<T_OpenSeaSales> => {
  // scroll based on blockNumberStart, don't use skip due to 5000 upper limit
  let _currentBlockNumberStart = blockNumberStart
  const firstSales = MAX_ITEMS_PER_SUBGRAPH_QUERY
  const results: T_OpenSeaSales = {} // use key = concat of timestamp and hash to ensure sortable and unique
  while (true) {
    const _newResults = await client.request(QueryProjectSales, {
      contractId: contractAddr,
      projectId: projectNumber,
      blockNumberStart: _currentBlockNumberStart,
      blockNumberLessThan: blockNumberEnd + 1,
      firstSales: firstSales,
    })
    const newSalesTables =
      _newResults.contract.projects[0].openSeaSaleLookupTables
    if (newSalesTables.length > 0) {
      // add all new results to total results (we might have some overlap!)
      newSalesTables.reduce((reduceResult, item, index) => {
        const _key = item.openSeaSale.blockTimestamp.concat(item.openSeaSale.id)
        reduceResult[_key] = item.openSeaSale
        return reduceResult
      }, results)
      // if response is not at max limit, we are done
      if (newSalesTables.length !== firstSales) {
        break
      } else {
        // response returned max sales, increase blockNumberStart to scroll
        // note: not using skip due to maximum skip of 5000 allowed on TheGraph
        // note: we will get duplicates on the new first block number. That is
        // desired because we don't want to miss any sales in that block!
        // duplicates handled by overwriting keys in results object.
        console.log(
          `Found ${MAX_ITEMS_PER_SUBGRAPH_QUERY} sales, scrolling to block: `,
          newSalesTables[newSalesTables.length - 1].openSeaSale.blockNumber,
          ' (at least one sale overlap is expected and okay!)'
        )
        _currentBlockNumberStart = parseInt(
          newSalesTables[newSalesTables.length - 1].openSeaSale.blockNumber
        )
      }
    } else {
      break
    }
  }
  return results
}
