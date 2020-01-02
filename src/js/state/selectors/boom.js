/* @flow */

import type {State} from "../types"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getUseBoomCache, getUseBoomIndex} from "../reducers/boomd"
import Tab from "../tab"

export const getBoomOptions = (state: State) => {
  let credentials = Tab.cluster(state)

  let opts = {
    searchSpace: getCurrentSpaceName(state),
    searchSpan: Tab.getSpanAsDates(state),
    adapter: "BrowserFetch",
    enableIndex: getUseBoomIndex(state),
    enableCache: getUseBoomCache(state)
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
