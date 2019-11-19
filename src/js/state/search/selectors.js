/* @flow */
import {createSelector} from "reselect"

import type {DateTuple} from "../../lib/TimeWindow"
import type {SpanArgs} from "./types"
import type {State} from "../types"
import brim, {type Span} from "../../brim"
import search from "./"

function getSpan(state: State) {
  return state.search.span
}

function getSpanFocus(state: State) {
  return state.search.spanFocus
}

function getSpanArgs(state: State) {
  return state.search.spanArgs
}

const getComputedSpan = createSelector<State, void, Span, SpanArgs>(
  getSpanArgs,
  (args) => {
    let [fromArg, toArg] = args
    return [search.computeArg(fromArg), search.computeArg(toArg)]
  }
)

const getSpanAsDates = createSelector<State, void, DateTuple, Span>(
  getSpan,
  ([from, to]) => [brim.time(from).toDate(), brim.time(to).toDate()]
)

const getSpanFocusAsDates = createSelector<State, void, ?DateTuple, ?Span>(
  getSpanFocus,
  (focus) => {
    if (focus) {
      let [from, to] = focus
      return [brim.time(from).toDate(), brim.time(to).toDate()]
    } else {
      return null
    }
  }
)

export default {
  getSpan,
  getSpanAsDates,
  getSpanFocus,
  getSpanFocusAsDates,
  getSpanArgs,
  getComputedSpan
}
