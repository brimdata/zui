/* @flow */
import type {SearchActions, SearchState} from "./types"

const init: SearchState = {
  span: [{sec: 0, ns: 0}, {sec: 1, ns: 0}],
  spanArgs: ["now - 5m", "now"],
  spanFocus: null
}

export default function reducer(
  state: SearchState = init,
  action: SearchActions
) {
  switch (action.type) {
    case "SEARCH_SPAN_SET":
      return {...state, span: action.span}
    case "SEARCH_SPAN_ARGS_SET":
      return {...state, spanArgs: action.spanArgs}
    case "SEARCH_SPAN_FOCUS_SET":
      return {...state, spanFocus: action.spanFocus}
    case "SEARCH_CLEAR":
      return {...init}
    default:
      return state
  }
}
