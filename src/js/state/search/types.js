/* @flow */
import type {DateTuple} from "../../lib/TimeWindow"
import type {Span, Ts} from "../../brim"

export type SearchState = {
  span: Span,
  spanArgs: SpanArgs,
  spanFocus: ?Span
}

export type TimeArg = string | Ts
export type SpanArgs = [TimeArg, TimeArg]

export type SearchActions =
  | SEARCH_SPAN_SET
  | SEARCH_SPAN_ARGS_SET
  | SEARCH_SPAN_FOCUS_SET
  | SEARCH_CLEAR

export type SEARCH_SPAN_SET = {type: "SEARCH_SPAN_SET", span: Span}
export type SEARCH_SPAN_ARGS_SET = {
  type: "SEARCH_SPAN_ARGS_SET",
  spanArgs: SpanArgs
}
export type SEARCH_SPAN_FOCUS_SET = {
  type: "SEARCH_SPAN_FOCUS_SET",
  spanFocus: ?Span
}
export type SEARCH_CLEAR = {type: "SEARCH_CLEAR"}

export type TabState = {
  program: string,
  span: DateTuple,
  spanFocus: ?DateTuple,
  space: string
}
