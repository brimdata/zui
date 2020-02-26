/* @flow */

import defaults from "./defaults"
import deliver from "./deliver"
import pcapsApi, {type PcapsGetArgs, type PcapsPostArgs} from "./pcapsApi"
import searchApi from "./searchApi"
import spacesApi, {type SpacesCreateArgs} from "./spacesApi"

type ZealotSearchArgs = {}

function client(hostUrl: string) {
  let host = defaults.host(hostUrl)
  let searchArgs = defaults.searchArgs()
  let debug = false

  function send(args: Object) {
    if (debug) {
      debug = false
      return args
    } else {
      return deliver(host, args)
    }
  }

  return {
    spaces: {
      list: () => send(spacesApi.list()),
      get: (name: string) => send(spacesApi.get(name)),
      create: (args: SpacesCreateArgs) => send(spacesApi.create(args))
    },
    pcaps: {
      post: (args: PcapsPostArgs) => send(pcapsApi.post(args)),
      get: (args: PcapsGetArgs) => send(pcapsApi.get(args))
    },
    search(zql: string, args: Object = {}) {
      return send(searchApi(zql, {...args, ...searchArgs}))
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
