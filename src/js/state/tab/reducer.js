/* @flow */
import {combineReducers} from "redux"

import brim from "../../brim"
import chartReducer from "../chart/reducer"
import columnsReducer from "../columns/reducer"
import historyReducer from "../History/reducer"
import reducersSearchBar from "../reducers/searchBar"
import search from "../search"
import viewerReducer from "../viewer/reducer"

export default combineReducers<*, *>({
  id: (state: string = brim.randomHash(), _) => state,
  search: search.reducer,
  searchBar: reducersSearchBar,
  viewer: viewerReducer,
  chart: chartReducer,
  columns: columnsReducer,
  history: historyReducer
})
