/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

const initialState = {
  host: "",
  port: "",
  user: "",
  pass: ""
}

export type Boomd = typeof initialState

export default createReducer(initialState, {
  BOOMD_CREDENTIALS_SET: (state, {credentials}) => credentials
})

export const getCredentials = (state: State) => state.boomd
export const getBoomHost = (state: State) => state.boomd.host
export const getBoomPort = (state: State) => state.boomd.port
export const getBoomUser = (state: State) => state.boomd.user
