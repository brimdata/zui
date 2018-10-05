/* @flow */

import createReducer from "./createReducer"

const initialState = {
  host: "",
  port: "",
  user: "",
  pass: ""
}

type Slice = typeof initialState
type State = {boomdCredentials: Slice}

export default createReducer(initialState, {
  BOOMD_CREDENTIALS_SET: (state, {credentials}) => credentials
})

export const getCredentials = (state: State) => state.boomdCredentials
export const getBoomHost = (state: State) => state.boomdCredentials.host
export const getBoomPort = (state: State) => state.boomdCredentials.port
export const getBoomUser = (state: State) => state.boomdCredentials.user
