/* @flow */

import {ANALYTIC_MAX_RESULTS} from "../../models/searches/AnalyticSearch"
import {PER_PAGE} from "../reducers/logViewer"
import type {Thunk} from "../reducers/types"
import {addEveryCountProc} from "../../searches/histogramSearch"
import {addHeadProc, hasAnalytics} from "../../lib/Program"
import {cancelBoomSearches, issueBoomSearch} from "./boomSearches"
import {clearViewer} from "../viewer/actions"
import {getInnerTimeWindow, getOuterTimeWindow} from "../reducers/timeWindow"
import {getSearchProgram} from "../selectors/searchBar"
import {getSearchRecord} from "../selectors/searchRecord"
import {recordSearch} from "../actions"
import {updateTab} from "./view"
import {validateProgram} from "./searchBar"
import viewerHandler from "../../viewer/viewerHandler"

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

  if (hasAnalytics(program)) {
    searches = [
      {
        name: "ViewerSearch",
        tag: "viewer",
        program: addHeadProc(program, ANALYTIC_MAX_RESULTS),
        span: outerSpan,
        handlers: [viewerHandler]
      }
    ]
  } else if (innerSpan) {
    searches = [
      {
        name: "ViewerSearch",
        tag: "viewer",
        program: addHeadProc(program, PER_PAGE),
        span: innerSpan,
        handlers: [viewerHandler]
      }
    ]
  } else {
    searches = [
      {
        name: "HistogramSearch",
        tag: "viewer",
        program: addEveryCountProc(program, outerSpan),
        span: outerSpan
      },
      {
        name: "ViewerSearch",
        tag: "viewer",
        program: addHeadProc(program, PER_PAGE),
        span: outerSpan,
        handlers: [viewerHandler]
      }
    ]
  }

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
