/* @flow */

import type {DateTuple} from "../../lib/TimeWindow"
import type {
  SEARCH_CLEAR,
  SEARCH_SPAN_ARGS_SET,
  SEARCH_SPAN_FOCUS_SET,
  SEARCH_SPAN_SET,
  SearchActions,
  SearchState,
  SpanArgs
} from "./types"
import type {TabActions} from "../tabs"
import brim, {type Span} from "../../brim"

const actions = {
  setSpan(span: Span): SEARCH_SPAN_SET {
    return {type: "SEARCH_SPAN_SET", span}
  },
  setSpanArgs(spanArgs: SpanArgs): SEARCH_SPAN_ARGS_SET {
    return {type: "SEARCH_SPAN_ARGS_SET", spanArgs}
  },
  setSpanArgsFromDates(dates: DateTuple): SEARCH_SPAN_ARGS_SET {
    let spanArgs = brim.dateTuple(dates).toSpan()
    return {type: "SEARCH_SPAN_ARGS_SET", spanArgs}
  },
  setSpanFocus(spanFocus: ?Span): SEARCH_SPAN_FOCUS_SET {
    return {type: "SEARCH_SPAN_FOCUS_SET", spanFocus}
  },
  clear(): SEARCH_CLEAR {
    return {type: "SEARCH_CLEAR"}
  }
}

const init: SearchState = {
  span: [{sec: 0, ns: 0}, {sec: 1, ns: 0}],
  spanArgs: ["now - 5m", "now"],
  spanFocus: null
}

function reducer(
  state: SearchState = init,
  action: TabActions | SearchActions
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

export default {
  ...actions,
  reducer
}
