/* @flow */
import type {ChartState} from "../chart/types"
import type {ColumnsState} from "../columns/types"
import type {SearchBar} from "../reducers/searchBar"
import type {SearchState} from "../search/types"
import type {ViewerState} from "../viewer/types"

export type TabState = {
  id: string,
  search: SearchState,
  searchBar: SearchBar,
  viewer: ViewerState,
  chart: ChartState,
  columns: ColumnsState
}
