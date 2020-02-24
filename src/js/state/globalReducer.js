/* @flow */
import {combineReducers} from "redux"

import type {InvestigationState} from "./Investigation/types"
import type {RecentFilesState} from "./RecentFiles/types"
import {VERSION} from "../initializers/initPersistance"
import Investigation from "./Investigation"
import RecentFiles from "./RecentFiles"

export type GlobalState = {
  investigation: InvestigationState,
  recentFiles: RecentFilesState
}

export default combineReducers<*, *>({
  investigation: Investigation.reducer,
  recentFiles: RecentFiles.reducer,
  version: () => VERSION
})
