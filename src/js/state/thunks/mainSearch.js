/* @flow */

import type {Thunk} from "../reducers/types"
import {cancelBoomSearches, issueBoomSearch} from "./boomSearches"
import {clearViewer} from "../viewer/actions"
import {createHistogramSearch} from "../../searches/templates/histogramSearch"
import {createViewerSearch} from "../../searches/templates/viewerSearch"
import {getInnerTimeWindow, getOuterTimeWindow} from "../reducers/timeWindow"
import {getSearchProgram} from "../selectors/searchBar"
import {getSearchRecord} from "../selectors/searchRecord"
import {recordSearch} from "../actions"
import {updateTab} from "./view"
import {validateProgram} from "./searchBar"
import viewerHandler from "../../searches/handlers/viewerHandler"

type Options = {
  saveToHistory: boolean
}

export const fetchMainSearch = ({
  saveToHistory = true
}: Options = {}): Thunk => (dispatch, getState) => {
  const state = getState()
  if (!dispatch(validateProgram())) return
  dispatch(updateTab(state))

  if (saveToHistory) {
    dispatch(recordSearch(getSearchRecord(state)))
  }

  dispatch(cancelBoomSearches("viewer"))
  dispatch(clearViewer())

  const program = getSearchProgram(state)
  const innerSpan = getInnerTimeWindow(state)
  const outerSpan = getOuterTimeWindow(state)
  let searches = []

  searches = [
    createHistogramSearch(program, outerSpan),
    createViewerSearch(program, outerSpan)
  ]

  // if (hasAnalytics(program)) {
  // return [new AnalyticSearch(program, outerSpan)]
  // }
  //
  // if (innerSpan) {
  //   return [new LogSearch(program, innerSpan)]
  // }
  //
  // return [
  //   new HistogramSearch(program, outerSpan),
  //   new LogSearch(program, outerSpan)
  // ]

  searches.forEach((template) => dispatch(issueBoomSearch(template)))
}
