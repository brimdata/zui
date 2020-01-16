/* @flow */
import {combineReducers} from "redux"

import brim from "../../brim"
import chartReducer from "../Chart/reducer"
import columnsReducer from "../Columns/reducer"
import historyReducer from "../History/reducer"
import reducersSearchBar from "../reducers/searchBar"
import searchReducer from "../Search/reducer"
import viewerReducer from "../viewer/reducer"

export default combineReducers<*, *>({
  id: (state: string = brim.randomHash(), _) => state,
  search: searchReducer,
  searchBar: reducersSearchBar,
  viewer: viewerReducer,
  chart: chartReducer,
  columns: columnsReducer,
  history: historyReducer
})
