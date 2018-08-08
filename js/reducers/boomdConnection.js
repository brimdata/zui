import createReducer from "./createReducer"

const initialState = {
  isConnected: false,
  isConnecting: true,
  error: false
}

export default createReducer(initialState, {
  BOOMD_CONNECTING: state => ({
    ...state,
    isConnecting: true,
    error: false
  }),
  BOOMD_CONNECTED: () => ({
    isConnecting: false,
    isConnected: true,
    error: false
  }),
  BOOMD_ERROR_SET: () => ({
    isConnecting: false,
    isConnected: false,
    error: true
  })
})

export const getBoomdError = state => state.boomdConnection.error
export const getBoomdIsConnected = state => state.boomdConnection.isConnected
export const getBoomdIsConnecting = state => state.boomdConnection.isConnecting
