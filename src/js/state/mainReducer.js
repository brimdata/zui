/* @flow */
import {combineReducers} from "redux"

import {VERSION} from "../initializers/initPersistance"
import Investigation from "./Investigation"

export default combineReducers<*, *>({
  investigation: Investigation.reducer,
  version: () => VERSION
})
