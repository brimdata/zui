
import { ChartState } from "../Chart/types";
import { ColumnsState } from "../Columns/types";
import { CurrentState } from "../Current/types";
import { HistoryState } from "../History/types";
import { LastState } from "../Last/types";
import { LayoutState } from "../Layout/types";
import { LogDetailsState } from "../LogDetails/types";
import { SearchBarState } from "../SearchBar/types";
import { SearchState } from "../Search/types";
import { ViewerState } from "../Viewer/types";

export type TabState = {
  id: string;
  current: CurrentState;
  search: SearchState;
  searchBar: SearchBarState;
  viewer: ViewerState;
  chart: ChartState;
  columns: ColumnsState;
  history: HistoryState;
  layout: LayoutState;
  logDetails: LogDetailsState;
  last: LastState;
};