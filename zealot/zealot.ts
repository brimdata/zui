import {createFetcher} from "./fetcher/fetcher"
import {pools, logs, search, archive} from "./api/mod"
import {getHost} from "./util/host"
import {getDefaultSearchArgs} from "./config/search_args"
import {
  SearchArgs,
  PoolArgs,
  LogsPostArgs,
  ZealotArgs,
  LogsPostPathsArgs
} from "./types"
import {IndexSearchArgs} from "./api/archive"

export function createZealot(
  hostUrl: string,
  args: ZealotArgs = {fetcher: createFetcher}
) {
  const host = getHost(hostUrl)
  const {promise, stream, upload} = args.fetcher(host)

  let searchArgs: SearchArgs = getDefaultSearchArgs()

  return {
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
      list: () => {
        return promise(pools.list())
      },
      get: (id: string) => {
        return promise(pools.get(id))
      },
      create: (args: PoolArgs) => {
        return promise(pools.create(args))
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
