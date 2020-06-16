/* @flow */
import {combineReducers} from "redux"

import type {InvestigationState} from "./Investigation/types"
import type {PrefsState} from "./Prefs/types"
import Investigation from "./Investigation"
import Prefs from "./Prefs"

export type GlobalState = {
  investigation: InvestigationState,
  prefs: PrefsState
}

export default combineReducers<*, *>({
  investigation: Investigation.reducer,
  prefs: Prefs.reducer
})
