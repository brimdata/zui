/* @flow */
import type {ChartState} from "../Chart/types"
import type {ColumnsState} from "../Columns/types"
import type {HistoryState} from "../History/types"
import type {SearchBarState} from "../SearchBar/types"
import type {SearchState} from "../Search/types"
import type {ViewerState} from "../Viewer/types"
import type {LayoutState} from "../Layout/types"
import type {LogDetailsState} from "../LogDetails/types"

export type TabState = {
  id: string,
  search: SearchState,
  searchBar: SearchBarState,
  viewer: ViewerState,
  chart: ChartState,
  columns: ColumnsState,
  history: HistoryState,
  layout: LayoutState,
  logDetails: LogDetailsState
}
