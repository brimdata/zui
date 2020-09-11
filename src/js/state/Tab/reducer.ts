import {combineReducers} from "redux"

import brim from "../../brim"
import chartReducer from "../Chart/reducer"
import columnsReducer from "../Columns/reducer"
import currentReducer from "../Current/reducer"
import historyReducer from "../History/reducer"
import lastReducer from "../Last/reducer"
import layoutReducer from "../Layout/reducer"
import logDetailsReducer from "../LogDetails/reducer"
import searchBarReducer from "../SearchBar/reducer"
import searchReducer from "../Search/reducer"
import viewerReducer from "../Viewer/reducer"

export default combineReducers<any, any>({
  id: (state: string = brim.randomHash(), _) => state,
  current: currentReducer,
  search: searchReducer,
  searchBar: searchBarReducer,
  viewer: viewerReducer,
  chart: chartReducer,
  columns: columnsReducer,
  history: historyReducer,
  logDetails: logDetailsReducer,
  layout: layoutReducer,
  last: lastReducer
})
