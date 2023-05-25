import {combineReducers} from "redux"
import {reducer as editor} from "../Editor/reducer"
import {reducer as inspector} from "src/js/state/Inspector/reducer"
import {reducer as layout} from "../Layout/reducer"
import {reducer as table} from "../Table/reducer"
import chart from "../Chart/reducer"
import logDetails from "../LogDetails/reducer"
import {reducer as results} from "../Results/reducer"
import {reducer as histogram} from "../Histogram/reducer"
import {nanoid} from "@reduxjs/toolkit"
import {reducer as resultsToolbar} from "../ResultsToolbar/slice"

const tabReducer = combineReducers({
  chart,
  editor,
  id: (state: string = nanoid(), _): string => state,
  lastFocused: (state: string = new Date().toISOString()): string => state,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  lastLocationKey: (state: string = ""): string => state,
  inspector,
  layout,
  logDetails,
  results,
  resultsToolbar,
  histogram,
  table,
})

export type TabReducer = typeof tabReducer

export default tabReducer
