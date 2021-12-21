import Inspector from "src/js/state/Inspector"
import {combineReducers} from "redux"
import brim from "../../brim"
import chartReducer from "../Chart/reducer"
import columnsReducer from "../Columns/reducer"
import layoutReducer from "../Layout/reducer"
import logDetailsReducer from "../LogDetails/reducer"
import searchReducer from "../Search/reducer"
import searchBarReducer from "../SearchBar/reducer"
import viewerReducer from "../Viewer/reducer"
import {tabLocalStateSlice} from "./local-state"

const tabReducer = combineReducers({
  id: (state: string = brim.randomHash(), _) => state,
  search: searchReducer,
  searchBar: searchBarReducer,
  viewer: viewerReducer,
  chart: chartReducer,
  columns: columnsReducer,
  logDetails: logDetailsReducer,
  layout: layoutReducer,
  localState: tabLocalStateSlice.reducer,
  inspector: Inspector.reducer
})

export type TabReducer = typeof tabReducer

export default tabReducer
