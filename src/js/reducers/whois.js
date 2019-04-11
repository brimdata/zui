/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

const initialState = {
  addr: "",
  text: "",
  isOpen: false,
  isFetching: false
}

export type Whois = typeof initialState

export default createReducer(initialState, {
  WHOIS_REQUEST: (state, {addr}) => ({
    ...state,
    addr,
    isFetching: true,
    text: ""
  }),
  WHOIS_SUCCESS: (state, {text}) => ({
    ...state,
    isFetching: false,
    text
  }),
  WHOIS_ERROR: (state, {error}) => ({
    ...state,
    isFetching: false,
    text: error
  }),
  WHOIS_OPEN: (state) => ({
    ...state,
    isOpen: true
  }),
  WHOIS_CLOSE: (state) => ({
    ...state,
    isOpen: false
  })
})

export const getWhoisText = (state: State) => {
  return state.whois.text
}

export const getWhoisIsOpen = (state: State) => {
  return state.whois.isOpen
}

export const getWhoisIsFetching = (state: State) => {
  return state.whois.isFetching
}

export const getWhoisAddr = (state: State) => {
  return state.whois.addr
}
