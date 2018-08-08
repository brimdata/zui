import createReducer from "./createReducer"

const initialState = {
  host: "localhost",
  port: 9867,
  user: "james",
  pass: "kerr"
}

export default createReducer(initialState, {
  BOOMD_CREDENTIALS_SET: (state, {credentials}) => credentials
})

export const getCredentials = state => state.boomdCredentials
