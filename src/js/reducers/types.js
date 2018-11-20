/* @flow */

import {Client} from "boom-js-client"
import type {Notices} from "./notices"
import type {CountByTime} from "./countByTime"
import type {SearchBar} from "./searchBar"
import type {TimeWindow} from "./timeWindow"
import type {Spaces} from "./spaces"
import type {BoomdCredentials} from "./boomdCredentials"
import type {LogViewer} from "./logViewer"

export type State = {
  notices: Notices,
  countByTime: CountByTime,
  searchBar: SearchBar,
  timeWindow: TimeWindow,
  spaces: Spaces,
  currentSpaceName: string,
  boomdCredentials: BoomdCredentials,
  logViewer: LogViewer
}

export type Dispatch = Function

export type Api = Client
