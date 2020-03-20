/* @flow */
import {combineReducers} from "redux"

import type {InvestigationState} from "./Investigation/types"
import type {SpacesState} from "./Spaces/types"
import {VERSION} from "../initializers/initPersistance"
import Investigation from "./Investigation"
import Spaces from "./Spaces"

export type GlobalState = {
  investigation: InvestigationState,
  spaces: SpacesState
}

export default combineReducers<*, *>({
  investigation: Investigation.reducer,
  spaces: Spaces.reducer,
  version: () => VERSION
})
