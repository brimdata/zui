/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

const initialState = {
  text: "",
  isOpen: false
}

export type Whois = typeof initialState

export default createReducer(initialState, {
  WHOIS_SUCCESS: (state, {text}) => ({
    ...state,
    text
  }),
  WHOIS_OPEN: state => ({
    ...state,
    isOpen: true
  }),
  WHOIS_CLOSE: state => ({
    ...state,
    isOpen: false
  }),
  WHOIS_ERROR: (state, {error}) => ({
    ...state,
    text: error
  })
})

export const getWhoisText = (state: State) => {
  return state.whois.text
}

export const getWhoisIsOpen = (state: State) => {
  return state.whois.isOpen
}
