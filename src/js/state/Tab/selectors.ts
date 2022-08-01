import {Pool} from "src/app/core/pools/pool"
import {createSelector} from "reselect"
import brim, {Span} from "../../brim"
import {DateTuple} from "../../lib/TimeWindow"
import Current from "../Current"
import {Lake} from "../Lakes/types"
import {SpanArgs} from "../Search/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Url from "../Url"
import {SearchParams} from "../Url/selectors"
import {createIsEqualSelector} from "../utils"
import {TabState} from "./types"
import activeTabSelect from "./activeTabSelect"

const lakeUrl = createSelector<State, Lake | null, string>(
  Current.getLake,
  (c) => {
    if (c) return c.host + ":" + c.port
    else return "localhost:9867"
  }
)

const getSpan = createSelector<State, SearchParams, Span>(
  Url.getSearchParams,
  ({spanArgs}) => {
    if (!spanArgs) return null
    return brim.span(spanArgs).toSpan()
  }
)

const _getSpanArgs = createSelector<State, TabState, Pool, SpanArgs>(
  Tabs.getActiveTab,
  Current.mustGetPool,
  (tab, pool) => {
    if (!pool.hasSpan() || !tab.search.spanArgs) return null
    const [from, to] = tab.search.spanArgs
    const [defaultFrom, defaultTo] = pool.defaultSpanArgs()
    return [from || defaultFrom, to || defaultTo]
  }
)

const getSpanArgs = createIsEqualSelector(_getSpanArgs, (args) => args)

const getComputedSpan = createSelector<State, SpanArgs, Span>(
  getSpanArgs,
  (args) => {
    if (!args) return null
    return brim.span(args).toSpan()
  }
)

const getSpanAsDates = createSelector<State, Span, DateTuple>(
  getSpan,
  (span) => {
    if (!span) return null
    return brim.span(span).toDateTuple()
  }
)

const getLastLocationKey = activeTabSelect((t) => t.lastLocationKey)

export default {
  lakeUrl,
  getPoolName: (state: State) => {
    const s = Current.mustGetPool(state)
    return s ? s.name : ""
  },
  getSpan,
  getSpanAsDates,
  getSpanArgs,
  getComputedSpan,
  getLastLocationKey,
}
