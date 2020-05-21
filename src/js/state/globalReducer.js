/* @flow */
import {combineReducers} from "redux"

import type {InvestigationState} from "./Investigation/types"
import type {SpacesState} from "./Spaces/types"
import Investigation from "./Investigation"
import Prefs from "./Prefs"
import Spaces from "./Spaces"

export type GlobalState = {
  investigation: InvestigationState,
  spaces: SpacesState
}

export default combineReducers<*, *>({
  investigation: Investigation.reducer,
  spaces: Spaces.reducer,
  prefs: Prefs.reducer
})
