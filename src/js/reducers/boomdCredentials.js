import createReducer from "./createReducer"

const initialState = {
  host: "",
  port: "",
  user: "",
  pass: " "
}

export default createReducer(initialState, {
  BOOMD_CREDENTIALS_SET: (state, {credentials}) => credentials
})

export const getCredentials = state => state.boomdCredentials
export const getBoomHost = state => state.boomdCredentials.host
export const getBoomPort = state => state.boomdCredentials.port
export const getBoomUser = state => state.boomdCredentials.user
