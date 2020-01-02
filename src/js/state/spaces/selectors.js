/* @flow */

import type {State} from "../types"
import {keys} from "lodash"
export default {
  names: (clusterId: string) => (state: State) =>
    keys<string>(state.spaces[clusterId]),

  get: (clusterId: string, name: string) => (state: State) =>
    state.spaces[clusterId][name]
}
