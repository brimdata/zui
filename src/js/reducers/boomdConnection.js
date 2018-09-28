/* @flow */

import createReducer from "./createReducer"

const initialState = {
  isConnected: false,
  isConnecting: false,
  error: null
}

export default createReducer(initialState, {
  BOOMD_CONNECTING: state => ({
    ...state,
    isConnecting: true,
    error: null
  }),
  BOOMD_CONNECTED: () => ({
    isConnecting: false,
    isConnected: true,
    error: null
  }),
  BOOMD_DISCONNECTED: state => ({
    ...state,
    isConnected: false
  }),
  BOOMD_ERROR_SET: (state, {error}) => ({
    isConnecting: false,
    isConnected: false,
    error
  })
})

export const getBoomdError = (state: Object) => state.boomdConnection.error
export const getBoomdIsConnected = (state: Object) =>
  state.boomdConnection.isConnected
export const getBoomdIsConnecting = (state: Object) =>
  state.boomdConnection.isConnecting
