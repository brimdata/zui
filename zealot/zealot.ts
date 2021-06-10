import {createFetcher} from "./fetcher/fetcher"
import {pools, logs, search, archive} from "./api/mod"
import {getHost} from "./util/host"
import {getDefaultSearchArgs} from "./config/search_args"
import {
  SearchArgs,
  Response,
  PoolArgs,
  PoolConfig,
  PoolStats,
  LogsPostArgs,
  ZealotArgs,
  LogsPostPathsArgs
} from "./types"
import {Context, Int64, Record, Time} from "./zed"
import {IndexSearchArgs} from "./api/archive"

export function createZealot(
  hostUrl: string,
  args: ZealotArgs = {fetcher: createFetcher}
) {
  const host = getHost(hostUrl)
  const {promise, stream, upload} = args.fetcher(host)

  let searchArgs: SearchArgs = getDefaultSearchArgs()

  return {
    events: () => {
      return new EventSource(`http://${host}/events`)
    },
    setSearchOptions: (args: Partial<SearchArgs>) => {
      searchArgs = {...searchArgs, ...args}
    },
    status: () => {
      return promise({method: "GET", path: "/status"})
    },
    version: () => {
      return promise({method: "GET", path: "/version"})
    },
    authMethod: () => {
      return promise({method: "GET", path: "/auth/method"})
    },
    authIdentity: () => {
      return promise({method: "GET", path: "/auth/identity"})
    },
    search: (zql: string, args?: Partial<SearchArgs>) => {
      return stream(search(zql, {...searchArgs, ...args}))
    },
    archive: {
      search: (args: IndexSearchArgs) => {
        return stream({
          ...archive.search(args),
          enhancers: searchArgs.enhancers
        })
      }
    },
    pools: {
      list: async (): Promise<PoolConfig[]> => {
        let values: Response<PoolConfig>[] = await promise(pools.list())
        if (!values) return []
        return values.map((res) => res.value)
      },
      get: async (id: string): Promise<PoolConfig> => {
        let res = await promise(pools.get(id))
        return res.value
      },
      stats: async (id: string): Promise<PoolStats> => {
        const res = await promise(pools.stats(id))
        if (!res) {
          return null
        }
        const rec = new Context().decodeRecord(res)
        const stats: PoolStats = {
          size: rec.get<Int64>("size").toInt(),
          span: null
        }
        const spanRec = rec.get<Record>("span")
        if (!spanRec.null) {
          stats.span = {
            ts: spanRec.get<Time>("ts").toBigInt(),
            dur: spanRec.get<Int64>("dur").toBigInt()
          }
        }
        return stats
      },
      create: async (args: PoolArgs): Promise<PoolConfig> => {
        let res = await promise(pools.create(args))
        return res.value
      },
      delete: (id: string) => {
        return promise(pools.delete(id))
      },
      update: (id: string, args: Partial<PoolArgs>) => {
        return promise(pools.update(id, args))
      }
    },
    logs: {
      post: (args: LogsPostArgs) => {
        return upload(logs.post(args))
      },
      postPaths: (args: LogsPostPathsArgs) => {
        return stream(logs.postPaths(args))
      }
    },
    inspect: {
      search: (zql: string, args?: Partial<SearchArgs>) => {
        return search(zql, {...searchArgs, ...args})
      }
    }
  }
}
