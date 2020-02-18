/* @flow */
import {combineReducers} from "redux"

import type {InvestigationState} from "./Investigation/types"
import {VERSION} from "../initializers/initPersistance"
import Investigation from "./Investigation"

export type MainState = {
  investigation: InvestigationState
}

export default combineReducers<*, *>({
  investigation: Investigation.reducer,
  version: () => VERSION
})
