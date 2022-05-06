import { gql } from "graphql-request";

import { GraphQLDatasource } from "../datasources/graphQL_datasource";
import { T_TokenZero } from "../types/graphQL_entities_def";

const QUERY_GET_TOKEN_ZEROS = gql`
  query getTokenZeros($first: Int!, $skip: Int!) {
    projects(
      first: $first
      skip: $skip
      orderBy: projectId
      where: WHERE_CLAUSE
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

  /**
   * This returns *all* T_TokenZero objects for all contracts in
   * contracts parameter (limited by first/skip parameters in variables)
   */
  async getAllTokenZerosOnContracts(
    variables: T_QueryVariable_GetTokenZeros,
    contracts: string[]
  ): Promise<T_TokenZero[]> {
    const contractsQuery = contracts.map((_contractId) => `"${_contractId}"`);
    const query = QUERY_GET_TOKEN_ZEROS.replace(
      "WHERE_CLAUSE",
      `{ invocations_not: 0, contract_in: [${contractsQuery}] }`
    );
    const resp = await this.#graphQLDatasource.query(query, variables);
    return resp.projects as T_TokenZero[];
  }

  /**
   * This returns *all* T_TokenZero objects for all projectIds in
   * projectIds parameter (limited by first/skip parameters in variables)
   */
  async getAllTokenZerosWithProjectIds(
    variables: T_QueryVariable_GetTokenZeros,
    projectIds: string[]
  ): Promise<T_TokenZero[]> {
    const projectIdsQuery = projectIds.map((_projectId) => `"${_projectId}"`);
    const query = QUERY_GET_TOKEN_ZEROS.replace(
      "WHERE_CLAUSE",
      `{ invocations_not: 0, id_in: [${projectIdsQuery}] }`
    );
    const resp = await this.#graphQLDatasource.query(query, variables);
    return resp.projects as T_TokenZero[];
  }
}
