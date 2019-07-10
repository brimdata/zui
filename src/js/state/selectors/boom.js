/* @flow */

import type {State} from "../types"
import {getCurrentCluster} from "../clusters/selectors"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"
import {getUseBoomCache, getUseBoomIndex} from "../reducers/boomd"

export const getBoomOptions = (state: State) => {
  let credentials = getCurrentCluster(state)

  let opts = {
    searchSpace: getCurrentSpaceName(state),
    searchSpan: getTimeWindow(state),
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
