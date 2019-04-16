/* @flow */

import type {State} from "../state/reducers/types"
import {
  getCredentials,
  getUseBoomCache,
  getUseBoomIndex
} from "../state/reducers/boomd"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getTimeWindow} from "../state/reducers/timeWindow"

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
