/* @flow */

import {
  type FetchArgs,
  type FetchGenerator,
  type FetchPromise,
  fetchGenerator,
  fetchPromise
} from "./fetcher"
import defaults from "./defaults"
import logsApi, {type LogsPostArgs} from "./logsApi"
import pcapsApi, {type PcapsGetArgs, type PcapsPostArgs} from "./pcapsApi"
import searchApi from "./searchApi"
import spacesApi, {type SpacesCreateArgs} from "./spacesApi"

export type TimeArg = string | Date
export type ZealotSearchArgs = {
  from: TimeArg,
  to: TimeArg,
  space: string
}

function client(hostUrl: string) {
  let host = defaults.host(hostUrl)
  let searchArgs = defaults.searchArgs()
  let debug = false

  function debugging() {
    if (debug) {
      debug = false
      return true
    } else {
      return false
    }
  }

  function send(args: FetchArgs): FetchPromise {
    // $FlowFixMe
    if (debugging()) return args
    return fetchPromise(host, args)
  }

  function sendStream(args: FetchArgs): FetchGenerator {
    // $FlowFixMe
    if (debugging()) return args
    return fetchGenerator(host, args)
  }

  async function sendCollectedStream(args: FetchArgs): FetchPromise {
    let records = []
    for await (let payload of fetchGenerator(host, args)) {
      if (payload.type === "SearchRecords")
        records = records.concat(payload.records)
    }
    return records
  }

  return {
    spaces: {
      list: () => send(spacesApi.list()),
      get: (name: string) => send(spacesApi.get(name)),
      create: (args: SpacesCreateArgs) => send(spacesApi.create(args)),
      delete: (name: string) => send(spacesApi.delete(name))
    },
    pcaps: {
      post: (args: PcapsPostArgs) => sendStream(pcapsApi.post(args)),
      get: (args: PcapsGetArgs) => send(pcapsApi.get(args))
    },
    logs: {
      post: (args: LogsPostArgs) => sendStream(logsApi.post(args))
    },
    search(zql: string, args: ZealotSearchArgs = {}) {
      let options = {...searchArgs, ...args}
      let sendArgs = searchApi(zql, options)
      if (debugging()) return sendArgs
      return sendCollectedStream(searchApi(zql, options))
    },
    searchStream(zql: string, args: ZealotSearchArgs = {}) {
      let options = {...searchArgs, ...args}
      let sendArgs = searchApi(zql, options)
      if (debugging()) return sendArgs
      return sendStream(sendArgs)
    },
    searchDefaults(args: ZealotSearchArgs) {
      searchArgs = {
        ...args,
        ...searchArgs
      }
    },
    inspect() {
      debug = true
      return this
    }
  }
}

export default {
  client
}
