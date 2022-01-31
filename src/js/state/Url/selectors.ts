import {createSelector} from "@reduxjs/toolkit"
import {mergeDefaultSpanArgs} from "app/search/utils/default-params"
import {
  decodeSearchParams,
  decodeSpanParams
} from "app/search/utils/search-params"
import {Pool} from "app/core/pools/pool"
import {getLocation, mustGetPool} from "../Current/selectors"
import {State} from "../types"
import {LocationDescriptorObject} from "history"
import {SpanArgs} from "../Search/types"

export type SearchParams = {
  program: string
  pins: []
  spanArgs: SpanArgs
}

export const getSearchParams = createSelector<
  State,
  LocationDescriptorObject,
  Pool,
  SearchParams
>(getLocation, mustGetPool, (location, pool) => {
  const params = decodeSearchParams(location.search)
  const spanArgs = mergeDefaultSpanArgs(params.spanArgs, pool)
  return {...params, spanArgs} as SearchParams
})

export const getSpanParams = createSelector(getLocation, (location) => {
  return decodeSpanParams(location.search, "from", "to")
})

export const getSearchProgram = createSelector(
  getSearchParams,
  (params) => params.program
)
