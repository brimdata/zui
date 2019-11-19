/* @flow */
import type {Span, Ts} from "../../brim"

export type SearchState = {
  span: Span,
  spanArgs: SpanArgs,
  spanFocus: ?Span
}

export type RelTimeArg = {|relTime: string|}
export type TimeArg = {|time: Ts|}
export type SpanItemArg = TimeArg | RelTimeArg
export type SpanArgs = [SpanItemArg, SpanItemArg]

export type SearchActions =
  | SEARCH_SPAN_SET
  | SEARCH_SPAN_ARGS_SET
  | SEARCH_SPAN_FOCUS_SET

export type SEARCH_SPAN_SET = {type: "SEARCH_SPAN_SET", span: Span}
export type SEARCH_SPAN_ARGS_SET = {
  type: "SEARCH_SPAN_ARGS_SET",
  spanArgs: SpanArgs
}
export type SEARCH_SPAN_FOCUS_SET = {
  type: "SEARCH_SPAN_FOCUS_SET",
  spanFocus: ?Span
}
