/* @flow */

import type {State} from "../types"
import Boomd from "./"
import Tab from "../Tab"

export default {
  usingCache: (state: State) => state.boomd.useCache,
  usingIndex: (state: State) => state.boomd.useIndex,
  getOptions: (state: State) => {
    let credentials = Tab.cluster(state)

    let opts = {
      searchSpaceId: Tab.getSpaceId(state),
      searchSpan: Tab.getSpanAsDates(state),
      adapter: "BrowserFetch",
      enableIndex: Boomd.usingIndex(state),
      enableCache: Boomd.usingCache(state)
    }
    if (credentials) {
      opts = {
        ...opts,
        username: credentials.username,
        password: credentials.password,
        host: credentials.host,
        port: parseInt(credentials.port)
      }
    }

    return opts
  }
}
