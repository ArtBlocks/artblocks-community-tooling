import { GraphQLClient } from 'graphql-request'

export class GraphQLDatasource {
  #client: GraphQLClient

  constructor(url: string) {
    this.#client = new GraphQLClient(url)
  }

  async query(query: string, variables: any): Promise<any> {
    return await this.#client.request(query, variables)
  }
}
