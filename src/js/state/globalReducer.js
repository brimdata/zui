/* @flow */
import {combineReducers} from "redux"

import type {InvestigationState} from "./Investigation/types"
import type {RecentFilesState} from "./RecentFiles/types"
import type {SpacesState} from "./Spaces/types"
import {VERSION} from "../initializers/initPersistance"
import Investigation from "./Investigation"
import RecentFiles from "./RecentFiles"
import Spaces from "./Spaces"

export type GlobalState = {
  investigation: InvestigationState,
  recentFiles: RecentFilesState,
  spaces: SpacesState
}

export default combineReducers<*, *>({
  investigation: Investigation.reducer,
  recentFiles: RecentFiles.reducer,
  spaces: Spaces.reducer,
  version: () => VERSION
})
