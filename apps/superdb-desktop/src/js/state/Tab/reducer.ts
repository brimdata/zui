import {combineReducers} from "redux"
import {reducer as editor} from "../Editor/reducer"
import {reducer as inspector} from "src/js/state/Inspector/reducer"
import {reducer as layout} from "../Layout/reducer"
import {reducer as table} from "../Table/reducer"
import logDetails from "../LogDetails/reducer"
import {reducer as results} from "../Results/reducer"
import {reducer as histogram} from "../Histogram/reducer"
import {reducer as selection} from "../Selection/reducer"
import {reducer as queryInfo} from "../QueryInfo/reducer"
import {nanoid} from "@reduxjs/toolkit"

// The names of all actions sent to these reducers
// must start with "TAB_" so that it will route it
// to the active tab reducer.

const tabReducer = combineReducers({
  editor,
  id: (state: string = nanoid(), _): string => state,
  lastFocused: (state: string = new Date().toISOString()): string => state,
  lastLocationKey: (state: string = ""): string => state,
  inspector,
  layout,
  logDetails,
  results,
  histogram,
  table,
  selection,
  queryInfo,
  title: (state = "Zui") => state,
})

export type TabReducer = typeof tabReducer

export default tabReducer
