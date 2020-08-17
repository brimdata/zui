/* @flow */
import type {ChartState} from "../Chart/types"
import type {ColumnsState} from "../Columns/types"
import type {CurrentState} from "../Current/types"
import type {HistoryState} from "../History/types"
import type {LayoutState} from "../Layout/types"
import type {LogDetailsState} from "../LogDetails/types"
import type {SearchBarState} from "../SearchBar/types"
import type {SearchState} from "../Search/types"
import type {ViewerState} from "../Viewer/types"

export type TabState = {
  id: string,
  current: CurrentState,
  search: SearchState,
  searchBar: SearchBarState,
  viewer: ViewerState,
  chart: ChartState,
  columns: ColumnsState,
  history: HistoryState,
  layout: LayoutState,
  logDetails: LogDetailsState
}
