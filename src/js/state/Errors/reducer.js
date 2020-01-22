/* @flow */

import type {ErrorsAction, ErrorsState} from "./types"
import {head} from "../../lib/Array"

const init: ErrorsState = []

export default function reducer(
  state: ErrorsState = init,
  action: ErrorsAction
): ErrorsState {
  switch (action.type) {
    case "ERROR_CREATE":
      return head([action.error, ...state], 30)
    case "ERRORS_CLEAR":
      return []
    default:
      return state
  }
}
