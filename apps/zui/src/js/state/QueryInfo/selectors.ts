import {createSelector} from "reselect"
import activeTabSelect from "../Tab/activeTabSelect"
import {find} from "lodash"

export const get = activeTabSelect((tab) => {
  return tab.queryInfo
})

export const getParseError = createSelector(get, (info) => info.error)
export const getIsParsed = createSelector(get, (info) => info.isParsed)
export const getPoolName = createSelector(get, (info) => {
  let source = find(info.sources, {kind: "Pool"})
  return source ? source.name : null
})
export const getGroupByKeys = createSelector(get, (info) => {
  return info.channels[0].aggregation_keys
})
export const hasAggregation = createSelector(get, (info) => {
  return !!info.channels[0].aggregation_keys
})
