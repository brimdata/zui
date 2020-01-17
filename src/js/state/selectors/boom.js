/* @flow */

import type {State} from "../types"
import Boomd from "../Boomd"
import Tab from "../Tab"

export const getBoomOptions = (state: State) => {
  let credentials = Tab.cluster(state)

  let opts = {
    searchSpace: Tab.spaceName(state),
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
