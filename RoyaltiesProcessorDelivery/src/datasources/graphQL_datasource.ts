import { request } from "graphql-request"

export class GraphQLDatasource {
    #url: string;

    constructor(url: string) {
        this.#url = url;
    }

    async query(query: string, varibles: any): Promise<any> {
        return await request(this.#url, query, varibles)
    }
}