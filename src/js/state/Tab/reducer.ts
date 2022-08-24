import {combineReducers} from "redux"
import {reducer as editor} from "../Editor/reducer"
import {reducer as inspector} from "src/js/state/Inspector/reducer"
import {reducer as layout} from "../Layout/reducer"
import brim from "../../brim"
import chart from "../Chart/reducer"
import columns from "../Columns/reducer"
import logDetails from "../LogDetails/reducer"
import search from "../Search/reducer"
import searchBar from "../SearchBar/reducer"
import viewer from "../Viewer/reducer"
import {reducer as results} from "../Results/reducer"
import {reducer as histogram} from "../Histogram/reducer"

const tabReducer = combineReducers({
  chart,
  columns,
  editor,
  id: (state: string = brim.randomHash(), _): string => state,
  lastFocused: (state: string = new Date().toISOString()): string => state,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  lastLocationKey: (state: string = ""): string => state,
  inspector,
  layout,
  logDetails,
  search,
  searchBar,
  viewer,
  results,
  histogram,
})

export type TabReducer = typeof tabReducer

export default tabReducer
