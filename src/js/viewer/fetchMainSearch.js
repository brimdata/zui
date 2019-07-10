/* @flow */

import type {Thunk} from "../state/types"
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
import SearchTemplateFactory from "../searches/SearchTemplateFactory"

type Options = {
  saveToHistory: boolean
}

export const fetchMainSearch = ({
  saveToHistory = true
}: Options = {}): Thunk => (dispatch, getState) => {
  const state = getState()
  if (!dispatch(validateProgram())) return
  dispatch(updateTab(state))
  if (saveToHistory) dispatch(recordSearch(getSearchRecord(state)))
  dispatch(cancelSearchesByTag("viewer"))
  dispatch(clearViewer())
  new SearchTemplateFactory({
    program: getSearchProgram(state),
    innerSpan: getInnerTimeWindow(state),
    outerSpan: getOuterTimeWindow(state),
    saveToHistory
  })
    .getTemplates()
    .forEach((template) => dispatch(issueSearch(template)))
}
