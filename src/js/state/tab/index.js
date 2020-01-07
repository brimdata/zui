/* @flow */
import {createSelector} from "reselect"

import type {DateTuple} from "../../lib/TimeWindow"
import {type Finding, getCurrentFinding} from "../reducers/investigation"
import type {SpanArgs} from "../search/types"
import type {State, Thunk} from "../types"
import type {TabState} from "./types"
import brim, {type Span, type Ts} from "../../brim"
import search from "../search"
import selectors from "./selectors"
import tabs from "../tabs"

const getSpan = createSelector<State, void, Span, TabState>(
  tabs.getActiveTab,
  (tab) => tab.search.span
)

const getSpanFocus = createSelector<State, void, ?Span, TabState>(
  tabs.getActiveTab,
  (tab) => tab.search.spanFocus
)

const getSpanArgs = createSelector<State, void, SpanArgs, TabState>(
  tabs.getActiveTab,
  (tab) => tab.search.spanArgs
)

const getComputedSpan = createSelector<State, void, Span, SpanArgs>(
  getSpanArgs,
  (args) => {
    return brim.span(args).toSpan()
  }
)

const getSpanAsDates = createSelector<State, void, DateTuple, Span>(
  getSpan,
  (span) => brim.span(span).toDateTuple()
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

const getPrevSpanArgs = createSelector<State, void, ?SpanArgs, ?Finding>(
  getCurrentFinding,
  (finding) => {
    if (finding) {
      return finding.search.spanArgs
    } else {
      return null
    }
  }
)

function computeSpan(now: Date = new Date()): Thunk {
  return function(dispatch, getState) {
    let args = getSpanArgs(getState())
    let span = brim
      .span(args)
      .recompute(now)
      .toSpan()
    dispatch(search.setSpan(span))
  }
}

function setFrom(ts: Ts): Thunk {
  return function(dispatch, getState) {
    let [_, to] = getSpanArgs(getState())
    dispatch(search.setSpanArgs([ts, to]))
  }
}

function setTo(ts: Ts): Thunk {
  return function(dispatch, getState) {
    let [from, _] = getSpanArgs(getState())
    dispatch(search.setSpanArgs([from, ts]))
  }
}

export default {
  computeSpan,
  setFrom,
  setTo,
  getSpan,
  getSpanAsDates,
  getSpanFocus,
  getSpanFocusAsDates,
  getSpanArgs,
  getPrevSpanArgs,
  getComputedSpan,
  ...selectors
}
