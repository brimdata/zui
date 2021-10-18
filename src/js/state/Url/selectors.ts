import {createSelector} from "@reduxjs/toolkit"
import {mergeDefaultSpanArgs} from "app/search/utils/default-params"
import {
  decodeSearchParams,
  decodeSpanParams
} from "app/search/utils/search-params"
import {BrimPool, Span} from "src/js/brim"
import {getLocation, mustGetPool} from "../Current/selectors"
import {State} from "../types"
import {LocationDescriptorObject} from "history"
import {SpanArgs} from "../Search/types"

export type SearchParams = {
  program: string
  pins: []
  spanArgs: SpanArgs
  spanArgsFocus: Span | null
  keep: boolean
}

export const getSearchParams = createSelector<
  State,
  LocationDescriptorObject,
  BrimPool,
  SearchParams
>(getLocation, mustGetPool, (location, pool) => {
  const params = decodeSearchParams(location.search)
  const spanArgs = mergeDefaultSpanArgs(params.spanArgs, pool)
  const spanArgsFocus =
    params.spanArgsFocus[0] && params.spanArgsFocus[1]
      ? params.spanArgsFocus
      : null
  return {...params, spanArgs, spanArgsFocus} as SearchParams
})

export const getSpanParams = createSelector(getLocation, (location) => {
  return decodeSpanParams(location.search, "from", "to")
})

const getDefaultSpanArgs = createSelector(mustGetPool, (pool) => {
  return pool.defaultSpanArgs()
})

export const getSpanParamsWithDefaults = createSelector(
  getSpanParams,
  getDefaultSpanArgs,
  (params, defaults) => {
    const [p1, p2] = params
    const [d1, d2] = defaults
    return [p1 || d1, p2 || d2]
  }
)

export const getSearchProgram = createSelector(
  getSearchParams,
  (params) => params.program
)
