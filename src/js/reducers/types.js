/* @flow */

import {Client} from "boom-js-client"
import type {Notices} from "./notices"
import type {CountByTime} from "./countByTime"
import type {SearchBar} from "./searchBar"
import type {TimeWindow} from "./timeWindow"
import type {Spaces} from "./spaces"
import type {BoomdCredentials} from "./boomdCredentials"
import type {LogViewer} from "./logViewer"
import type {SelectedColumns} from "./selectedColumns"
import type {ColumnWidths} from "./columnWidths"
import type {SearchStats} from "./searchStats"
import type {SearchHistory} from "./searchHistory"
import type {Whois} from "./whois"
import type {Analysis} from "./analysis"
import type {LogDetails} from "./logDetails"
import type {TuplesByUid} from "./tuplesByUid"

export type State = {
  analysis: Analysis,
  notices: Notices,
  countByTime: CountByTime,
  searchBar: SearchBar,
  timeWindow: TimeWindow,
  spaces: Spaces,
  boomdCredentials: BoomdCredentials,
  logViewer: LogViewer,
  selectedColumns: SelectedColumns,
  columnWidths: ColumnWidths,
  searchStats: SearchStats,
  searchHistory: SearchHistory,
  whois: Whois,
  logDetails: LogDetails,
  tuplesByUid: TuplesByUid
}
export type Dispatch = Function
export type Api = Client
