/* @flow */
import {combineReducers} from "redux"

import reducersSearchBar from "../reducers/searchBar"
import search from "../search"
import viewerReducer from "../viewer/reducer"

export default combineReducers<*, *>({
  search: search.reducer,
  searchBar: reducersSearchBar,
  viewer: viewerReducer
})
