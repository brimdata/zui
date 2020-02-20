/* @flow */

import {createSelector} from "reselect"

import type {GlobalState} from "../globalReducer"
import type {RecentFilesState} from "./types"

export default {
  getPaths: createSelector<GlobalState, void, string[], RecentFilesState>(
    (state) => state.recentFiles,
    (files) => {
      return (
        Object.entries(files)
          // $FlowFixMe
          .sort((a, b) => b[1] - a[1])
          .map(([key]) => key)
      )
    }
  )
}
