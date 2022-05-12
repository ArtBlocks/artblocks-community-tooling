import { gql } from "graphql-request";

import { GraphQLDatasource } from "../datasources/graphQL_datasource";
import { T_TokenZero } from "../types/graphQL_entities_def";

const QUERY_GET_FLAGSHIP_TOKEN_ZEROS = gql`
  query getTokenZeros($first: Int!, $skip: Int!) {
    projects(
      first: $first
      skip: $skip
      orderBy: projectId
      where: {
        invocations_not: 0
        contract_in: [
          "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a"
          "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270"
        ]
      }
    ) {
      id
      curationStatus
      tokens(where: { invocation: 0 }) {
        id
        tokenId
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
`;

type T_QueryVariable_GetTokenZeros = {
  first: number;
  skip: number;
};

export class TokenZeroRepository {
  #graphQLDatasource: GraphQLDatasource;

  constructor(graphQLDatasource: GraphQLDatasource) {
    this.#graphQLDatasource = graphQLDatasource;
  }

  async getAllTokenZeros(
    variables: T_QueryVariable_GetTokenZeros
  ): Promise<T_TokenZero[]> {
    const query = QUERY_GET_FLAGSHIP_TOKEN_ZEROS;
    const resp = await this.#graphQLDatasource.query(query, variables);
    return resp.projects as T_TokenZero[];
  }
}
