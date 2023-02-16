import {combineReducers} from "redux"
import {reducer as editor} from "../Editor/reducer"
import {reducer as inspector} from "src/js/state/Inspector/reducer"
import {reducer as layout} from "../Layout/reducer"
import {reducer as table} from "../Table/reducer"
import brim from "../../brim"
import chart from "../Chart/reducer"
import logDetails from "../LogDetails/reducer"
import viewer from "../Viewer/reducer"
import {reducer as results} from "../Results/reducer"
import {reducer as histogram} from "../Histogram/reducer"

const tabReducer = combineReducers({
  chart,
  editor,
  id: (state: string = brim.randomHash(), _): string => state,
  lastFocused: (state: string = new Date().toISOString()): string => state,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  lastLocationKey: (state: string = ""): string => state,
  inspector,
  layout,
  logDetails,
  viewer,
  results,
  histogram,
  table,
})

export type TabReducer = typeof tabReducer

export default tabReducer
