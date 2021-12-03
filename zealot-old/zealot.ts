import {createFetcher} from "./fetcher/fetcher"
import {pools, query} from "./api/mod"
import {getDefaultQueryArgs} from "./config/query-args"
import {
  BranchMeta,
  PoolArgs,
  PoolConfig,
  PoolStats,
  ZealotArgs,
  QueryArgs,
  PoolLoadArgs,
  ZResponse,
  Order
} from "./types"
import {decode, zed} from "@brimdata/zealot"
import {url} from "./util/utils"

async function responseToPoolConfigs(
  zresponse: ZResponse
): Promise<PoolConfig[]> {
  const records = await zresponse?.records()
  if (!records) return []
  return records.map<PoolConfig>((r) => {
    const layout = r.get<zed.Record>("layout")
    return {
      name: r.get<zed.String>("name").toString(),
      id: r.get<zed.String>("id").toString(),
      layout: {
        order: layout.get<zed.String>("order").toString() as Order,
        keys: layout.get<zed.Array>("keys").serialize()
      }
    } as PoolConfig
  })
}

export function createZealot(
  baseUrl: string,
  args: ZealotArgs = {fetcher: createFetcher}
) {
  const {promise, stream, source} = args.fetcher(baseUrl)

  let queryArgs: QueryArgs = getDefaultQueryArgs()

  return {
    events: () => {
      return source({path: "/events"})
    },
    url: (path: string): string => {
      return url(baseUrl, path)
    },
    setQueryOptions: (args: Partial<QueryArgs>) => {
      queryArgs = {...queryArgs, ...args}
    },
    status: () => {
      return promise({method: "GET", path: "/status"})
    },
    version: (signal?: AbortSignal) => {
      return promise({method: "GET", path: "/version", signal})
    },
    authMethod: (signal?: AbortSignal) => {
      return promise({method: "GET", path: "/auth/method", signal})
    },
    authIdentity: () => {
      return promise({method: "GET", path: "/auth/identity"})
    },
    query: (zql: string, args?: Partial<QueryArgs>) => {
      return stream(query(zql, {...queryArgs, ...args}))
    },
    pools: {
      list: async (): Promise<PoolConfig[]> => {
        let res = await stream(query("from :pools", {format: "zjson"}))
        return responseToPoolConfigs(res)
      },
      get: async (id: string): Promise<PoolConfig> => {
        const res = await stream(
          query(`from :pools | id == ${id} or name == "${id}"`, {
            format: "zjson"
          })
        )
        const values = await responseToPoolConfigs(res)
        if (!values || values.length == 0) throw new Error("pool not found")
        return values[0]
      },
      stats: async (id: string): Promise<PoolStats> => {
        const res = await promise(pools.stats(id))
        if (!res) {
          return null
        }
        const rec = decode(res)
        const stats: PoolStats = {
          size: rec.get<zed.Int64>("size").toInt(),
          span: null
        }
        const spanRec = rec.get<zed.Record>("span")
        if (!spanRec.null) {
          stats.span = {
            ts: spanRec.get<zed.Time>("ts").toBigInt(),
            dur: spanRec.get<zed.Int64>("dur").toBigInt()
          }
        }
        return stats
      },
      create: async (args: PoolArgs): Promise<BranchMeta> => {
        let res = await promise(pools.create(args))
        return res.value
      },
      delete: (id: string) => {
        return promise(pools.delete(id))
      },
      update: (id: string, args: Partial<PoolArgs>) => {
        return promise(pools.update(id, args))
      },
      load: async (poolId: string, branch: string, args: PoolLoadArgs) => {
        return await promise(pools.load(poolId, branch, args))
      }
    },
    inspect: {
      query: (zql: string, args?: Partial<QueryArgs>) => {
        return query(zql, {...queryArgs, ...args})
      }
    }
  }
}
