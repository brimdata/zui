/* @flow */
import {isEqual} from "lodash"

import type {Thunk} from "../reducers/types"
import {addToProbe, newProbe} from "../actions/investigation"
import {getCurrentProbe} from "../reducers/investigation"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getSearchBar} from "../selectors/searchBar"
import {getTimeWindow} from "../reducers/timeWindow"

export function recordSearch(): Thunk {
  return function(dispatch, getState) {
    let state = getState()
    let prevProbe = getCurrentProbe(state)
    let probe = {
      ts: new Date(),
      searchBar: getSearchBar(state),
      span: getTimeWindow(state),
      space: getCurrentSpaceName(state)
    }

    if (similarProbe(probe, prevProbe)) {
      dispatch(addToProbe(probe))
    } else {
      dispatch(newProbe(probe))
    }
  }
}

function similarProbe(a, b) {
  return a && b && isEqual(a.searchBar, b.searchBar) && isEqual(a.span, b.span)
}
