import {createSelector} from "reselect"
import brim, {BrimPool, Span} from "../../brim"
import {DateTuple} from "../../lib/TimeWindow"
import Chart from "../Chart"
import Current from "../Current"
import {SpanArgs} from "../Search/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Url from "../Url"
import {SearchParams} from "../Url/selectors"
import {createIsEqualSelector} from "../utils"
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
  Url.getSearchParams,
  ({spanArgs}) => {
    return brim.span(spanArgs).toSpan()
  }
)

const getSpanFocus = createSelector<State, TabState, Span | null | undefined>(
  Tabs.getActiveTab,
  (tab) => tab.search.spanFocus
)

const _getSpanArgs = createSelector<State, TabState, BrimPool, SpanArgs>(
  Tabs.getActiveTab,
  Current.mustGetPool,
  (tab, pool) => {
    const [from, to] = tab.search.spanArgs
    const [defaultFrom, defaultTo] = pool.defaultSpanArgs()
    return [from || defaultFrom, to || defaultTo]
  }
)

const getSpanArgs = createIsEqualSelector(_getSpanArgs, (args) => args)

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
  getPoolName: (state: State) => {
    const s = Current.mustGetPool(state)
    return s ? s.name : ""
  },
  isFetching: activeTabSelect<boolean>(tabIsFetching),
  getSpan,
  getSpanAsDates,
  getSpanFocus,
  getSpanFocusAsDates,
  getSpanArgs,
  getComputedSpan
}
