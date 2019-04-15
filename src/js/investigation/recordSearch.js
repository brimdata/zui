/* @flow */
import {isEqual} from "lodash"

import type {Thunk} from "../reducers/types"
import {createFinding, updateFinding} from "../actions/investigation"
import {getCurrentFinding} from "../reducers/investigation"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getSearchBar} from "../selectors/searchBar"
import {getTimeWindow} from "../reducers/timeWindow"

export function recordSearch(): Thunk {
  return function(dispatch, getState) {
    let state = getState()
    let prevFinding = getCurrentFinding(state)
    let finding = {
      ts: new Date(),
      searchBar: getSearchBar(state),
      span: getTimeWindow(state),
      space: getCurrentSpaceName(state)
    }

    if (similarFinding(finding, prevFinding)) {
      dispatch(updateFinding(finding))
    } else {
      dispatch(createFinding(finding))
    }
  }
}

function similarFinding(a, b) {
  return a && b && isEqual(a.searchBar, b.searchBar) && isEqual(a.span, b.span)
}
