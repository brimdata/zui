/* @flow */
import {combineReducers} from "redux"

import brim from "../../brim"
import chartReducer from "../Chart/reducer"
import columnsReducer from "../Columns/reducer"
import historyReducer from "../History/reducer"
import searchBarReducer from "../SearchBar/reducer"
import searchReducer from "../Search/reducer"
import viewerReducer from "../Viewer/reducer"
import logDetailsReducer from "../LogDetails/reducer"
import layoutReducer from "../Layout/reducer"

export default combineReducers<*, *>({
  id: (state: string = brim.randomHash(), _) => state,
  search: searchReducer,
  searchBar: searchBarReducer,
  viewer: viewerReducer,
  chart: chartReducer,
  columns: columnsReducer,
  history: historyReducer,
  logDetails: logDetailsReducer,
  layout: layoutReducer
})
