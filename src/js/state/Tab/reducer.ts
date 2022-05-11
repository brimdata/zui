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

const tabReducer = combineReducers({
  chart,
  columns,
  editor,
  id: (state: string = brim.randomHash(), _) => state,
  inspector,
  layout,
  logDetails,
  search,
  searchBar,
  viewer,
})

export type TabReducer = typeof tabReducer

export default tabReducer
