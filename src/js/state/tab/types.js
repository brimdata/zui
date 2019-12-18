/* @flow */
import type {SearchBar} from "../reducers/searchBar"
import type {SearchState} from "../search/types"
import type {ViewerState} from "../viewer/types"

export type TabState = {
  search: SearchState,
  searchBar: SearchBar,
  viewer: ViewerState
}
