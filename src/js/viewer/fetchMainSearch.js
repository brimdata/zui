/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {Thunk} from "../state/types"
import {addEveryCountProc} from "../searches/histogramSearch"
import {addHeadProc, hasAnalytics} from "../lib/Program"
import {cancelSearchesByTag} from "../searches/cancelSearch"
import {clearViewer} from "../state/viewer/actions"
import {
  getInnerTimeWindow,
  getOuterTimeWindow
} from "../state/reducers/timeWindow"
import {getSearchProgram} from "../state/selectors/searchBar"
import {getSearchRecord} from "../state/selectors/searchRecord"
import {issueSearch} from "../searches/issueSearch"
import {recordSearch} from "../state/actions"
import {updateTab} from "../state/thunks/view"
import {validateProgram} from "../state/thunks/searchBar"
import viewerHandler from "./viewerHandler"

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

  dispatch(cancelSearchesByTag("viewer"))
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

  searches.forEach((template) => dispatch(issueSearch(template)))
}
