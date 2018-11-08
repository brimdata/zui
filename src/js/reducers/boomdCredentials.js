/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

const initialState = {
  host: "",
  port: "",
  user: "",
  pass: ""
}

export type BoomdCredentials = typeof initialState

export default createReducer(initialState, {
  BOOMD_CREDENTIALS_SET: (state, {credentials}) => credentials
})

export const getCredentials = (state: State) => state.boomdCredentials
export const getBoomHost = (state: State) => state.boomdCredentials.host
export const getBoomPort = (state: State) => state.boomdCredentials.port
export const getBoomUser = (state: State) => state.boomdCredentials.user
