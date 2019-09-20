/* @flow */

import type {Thunk} from "redux-thunk"

import {
  errorWhois,
  openWhois,
  requestWhois,
  showModal,
  successWhois
} from "../actions"
import {whois} from "../../lib/System"

export const fetchWhois = (
  addr: string,
  clientFunc: (string) => Promise<string> = whois
): Thunk => (dispatch) => {
  dispatch(requestWhois(addr))
  dispatch(showModal("whois"))

  return clientFunc(addr)
    .then((text) => dispatch(successWhois(text)))
    .catch((err) => dispatch(errorWhois(err)))
}
