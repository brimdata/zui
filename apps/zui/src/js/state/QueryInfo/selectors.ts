import {createSelector} from "reselect"
import activeTabSelect from "../Tab/activeTabSelect"

export const get = activeTabSelect((tab) => {
  return tab.queryInfo
})

export const getParseError = createSelector(get, (info) => info.error)
export const getIsParsed = createSelector(get, (info) => info.isParsed)
export const getIsSummarized = createSelector(get, (info) => info.isSummarized)
