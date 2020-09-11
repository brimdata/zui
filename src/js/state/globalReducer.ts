import {combineReducers} from "redux"

import {InvestigationState} from "./Investigation/types"
import {PrefsState} from "./Prefs/types"
import Investigation from "./Investigation"
import Prefs from "./Prefs"
import Clusters from "./Clusters"
import {ClustersState} from "./Clusters/types"

export type GlobalState = {
  clusters: ClustersState
  investigation: InvestigationState
  prefs: PrefsState
}

export default combineReducers<any, any>({
  clusters: Clusters.reducer,
  investigation: Investigation.reducer,
  prefs: Prefs.reducer
})
