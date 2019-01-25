/* @flow */

import * as System from "../lib/System"
import type {Thunk} from "redux-thunk"

export const fetchWhois = (
  addr: string,
  clientFunc: string => Promise<string> = System.whois
): Thunk => dispatch => {
  dispatch(requestWhois(addr))

  return clientFunc(addr)
    .then(text => dispatch(successWhois(text)))
    .catch(err => dispatch(errorWhois(err)))
    .finally(dispatch(openWhois()))
}

export const successWhois = (text: string) => ({
  type: "WHOIS_SUCCESS",
  text
})

export const errorWhois = (error: string) => ({
  type: "WHOIS_ERROR",
  error
})

export const requestWhois = (addr: string) => ({
  type: "WHOIS_REQUEST",
  addr
})

export const openWhois = () => ({
  type: "WHOIS_OPEN"
})

export const closeWhois = () => ({
  type: "WHOIS_CLOSE"
})
