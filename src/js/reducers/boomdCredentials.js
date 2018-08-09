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
