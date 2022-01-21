import {createFetcher} from "./fetcher/fetcher"
import {pools, query} from "./api/mod"
import {getHost} from "./util/host"
import {getDefaultQueryArgs} from "./config/query-args"
import nodeFetch from "node-fetch"
import {
  BranchMeta,
  Response,
  PoolArgs,
  PoolConfig,
  PoolStats,
  ZealotArgs,
  QueryArgs,
  PoolLoadArgs
} from "./types"
import {Context, Int64, Record, Time} from "./zed/index"
import {url} from "./util/utils"
import {parseContentType} from "./fetcher/contentType"
import {createError} from "./util/error"

export function createZealot(
  hostUrl: string,
  args: ZealotArgs = {fetcher: createFetcher}
) {
  const host = getHost(hostUrl)
  const {promise, stream} = args.fetcher(host)

  let queryArgs: QueryArgs = getDefaultQueryArgs()

  return {
    events: () => {
      return new EventSource(`http://${host}/events`)
    },
    url: (path: string): string => {
      return url(host, path)
    },
    setQueryOptions: (args: Partial<QueryArgs>) => {
      queryArgs = {...queryArgs, ...args}
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
    query: (zql: string, args?: Partial<QueryArgs>) => {
      return stream(query(zql, {...queryArgs, ...args}))
    },
    pools: {
      list: async (): Promise<PoolConfig[]> => {
        let values: Response<PoolConfig>[] = await promise(
          query("from :pools", {format: "json"})
        )
        if (!values) return []
        return values.map((res) => res.value)
      },
      get: async (id: string): Promise<PoolConfig> => {
        let values: Response<PoolConfig>[] = await promise(
          query(`from :pools | id == ${id} or name == "${id}"`, {
            format: "json"
          })
        )
        if (!values || values.length == 0) throw new Error("pool not found")
        return values[0].value
      },
      stats: async (id: string): Promise<PoolStats | null> => {
        const res = await promise(pools.stats(id))
        if (!res) {
          return null
        }
        const rec = new Context().decodeRecord(res)
        const stats: PoolStats = {
          size: rec.get<Int64>("size").toInt() || 0,
          span: null
        }
        const spanRec = rec.get<Record>("span")
        if (!spanRec.null) {
          stats.span = {
            ts: spanRec.get<Time>("ts").toBigInt() || BigInt(0),
            dur: spanRec.get<Int64>("dur").toBigInt() || BigInt(0)
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
        const {path, ...rest} = pools.load(poolId, branch, args)
        const resp = await nodeFetch(url(host, path), rest)
        const content = await parseContentType(resp)
        return resp.ok ? content : Promise.reject(createError(content))
      }
    },
    inspect: {
      query: (zql: string, args?: Partial<QueryArgs>) => {
        return query(zql, {...queryArgs, ...args})
      }
    }
  }
}
