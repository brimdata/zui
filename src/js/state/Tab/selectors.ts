import {SearchParams} from "app/router/hooks/use-search-params"
import {createSelector} from "reselect"
import brim, {Span} from "../../brim"
import {DateTuple} from "../../lib/TimeWindow"
import Chart from "../Chart"
import Current from "../Current"
import History from "../History"
import {SpanArgs} from "../Search/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Viewer from "../Viewer"
import {Workspace} from "../Workspaces/types"
import activeTabSelect from "./activeTabSelect"
import {TabState} from "./types"

const workspaceUrl = createSelector<State, Workspace | null, string>(
  Current.getWorkspace,
  (c) => {
    if (c) return c.host + ":" + c.port
    else return "localhost:9867"
  }
)

export function tabIsFetching(tab: TabState) {
  return Viewer.isFetching(tab) || Chart.isFetching(tab)
}

const getSpan = createSelector<State, SearchParams, Span>(
  Current.getSearchParams,
  ({spanArgs}) => {
    return brim.span(spanArgs).toSpan()
  }
)

const getSpanFocus = createSelector<State, TabState, Span | null | undefined>(
  Tabs.getActiveTab,
  (tab) => tab.search.spanFocus
)

const getSpanArgs = createSelector<State, TabState, SpanArgs>(
  Tabs.getActiveTab,
  (tab) => tab.search.spanArgs
)

const getComputedSpan = createSelector<State, SpanArgs, Span>(
  getSpanArgs,
  (args) => {
    return brim.span(args).toSpan()
  }
)

const getSpanAsDates = createSelector<State, Span, DateTuple>(getSpan, (span) =>
  brim.span(span).toDateTuple()
)

const getSpanFocusAsDates = createSelector<
  State,
  Span | null | undefined,
  DateTuple | null | undefined
>(getSpanFocus, (focus) => {
  if (focus) {
    const [from, to] = focus
    return [brim.time(from).toDate(), brim.time(to).toDate()]
  } else {
    return null
  }
})

export default {
  workspaceUrl,
  getSpaceName: (state: State) => {
    const s = Current.mustGetSpace(state)
    return s ? s.name : ""
  },
  currentEntry: activeTabSelect(History.current),
  canGoBack: activeTabSelect(History.canGoBack),
  canGoForward: activeTabSelect(History.canGoForward),
  isFetching: activeTabSelect<boolean>(tabIsFetching),
  getSpan,
  getSpanAsDates,
  getSpanFocus,
  getSpanFocusAsDates,
  getSpanArgs,
  getComputedSpan
}
