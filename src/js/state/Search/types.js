/* @flow */
import type {DateTuple} from "../../lib/TimeWindow"
import type {Span, Ts} from "../../brim"

export type SearchState = {
  span: Span,
  spanArgs: SpanArgs,
  spanFocus: ?Span,
  space: string,
  clusterId: string
}

export type SearchArgs = {
  tableProgram: string,
  chartProgram: string,
  span: DateTuple,
  space: string,
  type: SearchType
}
export type SearchType = "zoom" | "analytics" | "events"
export type TimeArg = string | Ts
export type SpanArgs = [TimeArg, TimeArg]

export type SearchActions =
  | SEARCH_SPAN_SET
  | SEARCH_SPAN_ARGS_SET
  | SEARCH_SPAN_FOCUS_SET
  | SEARCH_CLEAR
  | SEARCH_SPACE_SET
  | SEARCH_CLUSTER_SET

export type SEARCH_CLUSTER_SET = {
  type: "SEARCH_CLUSTER_SET",
  clusterId: string
}
export type SEARCH_SPACE_SET = {
  type: "SEARCH_SPACE_SET",
  space: string
}
export type SEARCH_SPAN_SET = {
  type: "SEARCH_SPAN_SET",
  span: Span
}
export type SEARCH_SPAN_ARGS_SET = {
  type: "SEARCH_SPAN_ARGS_SET",
  spanArgs: SpanArgs
}
export type SEARCH_SPAN_FOCUS_SET = {
  type: "SEARCH_SPAN_FOCUS_SET",
  spanFocus: ?Span
}
export type SEARCH_CLEAR = {
  type: "SEARCH_CLEAR"
}
