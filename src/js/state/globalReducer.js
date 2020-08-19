/* @flow */
import {combineReducers} from "redux"

import type {InvestigationState} from "./Investigation/types"
import type {PrefsState} from "./Prefs/types"
import Investigation from "./Investigation"
import Prefs from "./Prefs"
import Clusters from "./Clusters"
import type {ClustersState} from "./Clusters/types"

export type GlobalState = {
  clusters: ClustersState,
  investigation: InvestigationState,
  prefs: PrefsState
}

export default combineReducers<*, *>({
  clusters: Clusters.reducer,
  investigation: Investigation.reducer,
  prefs: Prefs.reducer
})
