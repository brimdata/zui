/* @flow */

import {createSelector} from "reselect"

import type {Cluster} from "../Clusters/types"
import type {DateTuple} from "../../lib/TimeWindow"
import type {SpanArgs} from "../Search/types"
import type {State} from "../types"
import type {TabState} from "./types"
import Chart from "../Chart"
import Current from "../Current"
import History from "../History"
import Tabs from "../Tabs"
import Viewer from "../Viewer"
import activeTabSelect from "./activeTabSelect"
import brim, {type Span} from "../../brim"

const clusterUrl = createSelector<State, void, string, ?Cluster>(
  Current.getConnection,
  (c) => {
    if (c) return c.host + ":" + c.port
    else return "localhost:9867"
  }
)

export function tabIsFetching(tab: TabState) {
  return Viewer.isFetching(tab) || Chart.isFetching(tab)
}

const getSpan = createSelector<State, void, Span, TabState>(
  Tabs.getActiveTab,
  (tab) => tab.search.span
)

const getSpanFocus = createSelector<State, void, ?Span, TabState>(
  Tabs.getActiveTab,
  (tab) => tab.search.spanFocus
)

const getSpanArgs = createSelector<State, void, SpanArgs, TabState>(
  Tabs.getActiveTab,
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

export default {
  clusterUrl,
  getSpaceName: (state: State) => {
    const s = Current.getSpace(state)
    return s ? s.name : ""
  },
  currentEntry: activeTabSelect(History.current),
  canGoBack: activeTabSelect(History.canGoBack),
  canGoForward: activeTabSelect(History.canGoForward),
  isFetching: activeTabSelect<boolean>(tabIsFetching),
  getSearchTs: activeTabSelect<number>((tab) => tab.search.ts),
  getSpan,
  getSpanAsDates,
  getSpanFocus,
  getSpanFocusAsDates,
  getSpanArgs,
  getComputedSpan
}
