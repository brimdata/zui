/* @flow */

import {Client} from "boom-js-client"
import type {Notices} from "./notices"
import type {CountByTime} from "./countByTime"
import type {SearchBar} from "./searchBar"
import type {TimeWindow} from "./timeWindow"
import type {Spaces} from "./spaces"

export type State = {
  notices: Notices,
  countByTime: CountByTime,
  searchBar: SearchBar,
  timeWindow: TimeWindow,
  spaces: Spaces,
  currentSpaceName: string
}

export type Dispatch = Function

export type Api = Client
