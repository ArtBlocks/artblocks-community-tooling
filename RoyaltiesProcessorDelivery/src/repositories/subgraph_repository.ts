import { Client, fetchExchange, cacheExchange, dedupExchange } from 'urql/core'
import { retryExchange } from '@urql/exchange-retry'
import { RetryExchangeOptions } from '@urql/exchange-retry/dist/types/retryExchange'
import {
  GetProjectsInfoQuery,
  GetProjectsInfoQueryVariables,
  GetProjectsInfoDocument,
} from '../graphql'

const ONE_MILLION = 1e6

export type ProjectData = {
  invocations: string
  projectId: string
  contractAddress: string
  id: string
  curationStatus?: string | null
  name?: string | null
  artistAddress: string
  additionalPayee?: string | null
  additionalPayeePercentage?: string | null
  reservoirCollectionString: string
}

export class SubgraphRepository {
  client: Client

  constructor() {
    const retryOptions: RetryExchangeOptions = {
      maxNumberAttempts: 3,
      retryIf: (error) => !!error,
    }

    this.client = new Client({
      url: 'https://api.thegraph.com/subgraphs/name/artblocks/art-blocks',
      fetch: fetch as any,
      exchanges: [
        dedupExchange,
        cacheExchange,
        retryExchange(retryOptions),
        fetchExchange,
      ],
      fetchOptions: {},
    })
  }

  async getAllProjectsBatch(
    maxProjectsPerQuery: number,
    offset: number,
    contracts: string[]
  ): Promise<GetProjectsInfoQuery> {
    const { data, error } = await this.client
      .query<GetProjectsInfoQuery, GetProjectsInfoQueryVariables>(
        GetProjectsInfoDocument,
        {
          first: maxProjectsPerQuery,
          skip: offset,
          contracts: contracts,
        }
      )
      .toPromise()

    if (error) {
      error.message = 'GetAllProjects query has failed: ' + error.message
      throw error
    }

    if (!data) {
      throw new Error('data is undefined')
    }

    return data
  }

  async getAllProjectInfo(contracts: string[]): Promise<ProjectData[]> {
    const maxProjectsPerQuery = 1000
    const allProjects: ProjectData[] = []
    while (true) {
      const data = await this.getAllProjectsBatch(
        maxProjectsPerQuery,
        allProjects.length,
        contracts
      )

      data.projects.forEach((project) => {
        const startTokenId = parseInt(project.projectId) * ONE_MILLION
        const endTokenId = startTokenId + (ONE_MILLION - 1)
        allProjects.push({
          id: project.id,
          projectId: project.projectId,
          name: project.name,
          invocations: project.invocations,
          contractAddress: project.contract.id,
          artistAddress: project.artistAddress,
          additionalPayee: project.additionalPayee,
          additionalPayeePercentage: project.additionalPayeePercentage,
          curationStatus: project.curationStatus,
          reservoirCollectionString: `${project.contract.id}:${startTokenId}-${endTokenId}`,
        })
      })

      if (data.projects.length !== maxProjectsPerQuery) {
        break
      }
    }
    return allProjects
  }
}
