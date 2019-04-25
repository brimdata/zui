/* @flow */

import type {State} from "../types"
import {
  getCredentials,
  getUseBoomCache,
  getUseBoomIndex
} from "../reducers/boomd"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"

export const getBoomOptions = (state: State) => {
  const credentials = getCredentials(state)

  return {
    username: credentials.user,
    password: credentials.pass,
    host: credentials.host,
    port: parseInt(credentials.port),
    searchSpace: getCurrentSpaceName(state),
    searchSpan: getTimeWindow(state),
    adapter: "BrowserFetch",
    enableIndex: getUseBoomIndex(state),
    enableCache: getUseBoomCache(state)
  }
}
