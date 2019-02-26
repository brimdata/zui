/* @flow */

import {BoomClient} from "boom-js-client"

import type {State} from "../reducers/types"
import {
  getCredentials,
  getUseBoomCache,
  getUseBoomIndex
} from "../reducers/boomd"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"

export const getBoomClient = (state: State) => {
  const credentials = getCredentials(state)

  return new BoomClient({
    username: credentials.user,
    password: credentials.pass,
    host: credentials.host,
    port: credentials.port,
    searchSpace: getCurrentSpaceName(state),
    searchSpan: getTimeWindow(state),
    adapter: "BrowserFetch",
    enableIndex: getUseBoomIndex(state),
    enableCache: getUseBoomCache(state)
  })
}
