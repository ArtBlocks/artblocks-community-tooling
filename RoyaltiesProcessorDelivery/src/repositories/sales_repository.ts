import { gql } from "graphql-request"

import { GraphQLDatasource } from "../datasources/graphQL_datasource";
import { T_Sale } from "../types/graphQL_entities_def";

const QUERY_GET_SALES = gql`
query getSales($first: Int!, $skip: Int!) {
  sales(first: $first, skip: $skip, where: {WHERE_CLAUSE}, orderBy: blockNumber, orderDirection: desc) {
    id
    exchange
    saleType
    price
    paymentToken
    blockNumber
    blockTimestamp
    isPrivate
    summaryTokensSold
    saleLookupTables {
      id
      token {
        id
        contract {
          id
        }
        project {
          id
          name
          artistAddress
          curationStatus
          additionalPayee
          additionalPayeePercentage
        }
      }
    }
  }
}`;

type T_QueryVariable_GetSales = {
  first: number;
  skip: number;
};

export class SalesRepository {
  #graphQLDatasource: GraphQLDatasource;

  constructor(graphQLDatasource: GraphQLDatasource) {
    this.#graphQLDatasource = graphQLDatasource;
  }

  async getSalesBetweenBlockNumbers(
    variables: T_QueryVariable_GetSales,
    blockNumberGte: number,
    blockNumberLt: number
  ): Promise<T_Sale[]> {
    const query = QUERY_GET_SALES.replace(
      "WHERE_CLAUSE",
      `blockNumber_gte: ${blockNumberGte}, blockNumber_lt: ${blockNumberLt}`
    );

    const resp = await this.#graphQLDatasource.query(query, variables);
    return resp.sales as T_Sale[];
  }
}