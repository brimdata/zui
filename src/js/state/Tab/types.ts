import {ChartState} from "../Chart/types"
import {ColumnsState} from "../Columns/types"
import {LayoutState} from "../Layout/types"
import {LogDetailsState} from "../LogDetails/types"
import {SearchBarState} from "../SearchBar/types"
import {SearchState} from "../Search/types"
import {ViewerState} from "../Viewer/types"

export type TabState = {
  id: string
  search: SearchState
  searchBar: SearchBarState
  viewer: ViewerState
  chart: ChartState
  columns: ColumnsState
  layout: LayoutState
  logDetails: LogDetailsState
}
