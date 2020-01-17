/* @flow */
import type {ChartState} from "../Chart/types"
import type {ColumnsState} from "../Columns/types"
import type {HistoryState} from "../History/types"
import type {SearchBar} from "../reducers/searchBar"
import type {SearchState} from "../Search/types"
import type {ViewerState} from "../Viewer/types"

export type TabState = {
  id: string,
  search: SearchState,
  searchBar: SearchBar,
  viewer: ViewerState,
  chart: ChartState,
  columns: ColumnsState,
  history: HistoryState
}
