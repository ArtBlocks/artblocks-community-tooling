import { gql } from "graphql-request"

import { GraphQLDatasource } from "../datasources/graphQL_datasource";
import { T_OpenSeaSale } from "../types/graphQL_entities_def";

const QUERY_GET_OPENSEA_SALES = gql`
query getOpenSeaSales($first: Int!, $skip: Int!) {
  openSeaSales(first: $first, skip: $skip, where: {WHERE_CLAUSE}, orderBy: blockNumber, orderDirection: desc) {
    id
    openSeaVersion
    saleType
    price
    paymentToken
    blockNumber
    blockTimestamp
    isPrivate
    summaryTokensSold
    openSeaSaleLookupTables {
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

type T_QueryVariable_GetOpenSeaSales = {
  first: number;
  skip: number;
};

export class OpenseaSalesRepository {
  #graphQLDatasource: GraphQLDatasource;

  constructor(graphQLDatasource: GraphQLDatasource) {
    this.#graphQLDatasource = graphQLDatasource;
  }

  async getSalesBetweenBlockNumbers(
    variables: T_QueryVariable_GetOpenSeaSales,
    blockNumberGte: number,
    blockNumberLt: number
  ): Promise<T_OpenSeaSale[]> {
    const query = QUERY_GET_OPENSEA_SALES.replace(
      "WHERE_CLAUSE",
      `blockNumber_gte: ${blockNumberGte}, blockNumber_lt: ${blockNumberLt}`
    );

    const resp = await this.#graphQLDatasource.query(query, variables);
    return resp.openSeaSales as T_OpenSeaSale[];
  }
}