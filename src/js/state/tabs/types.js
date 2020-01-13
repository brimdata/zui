/* @flow */
import type {SearchState} from "../search/types"
import type {TabState} from "../tab/types"

export type TabsState = {active: string, data: TabState[]}
export type TabActions = TABS_ADD | TABS_REMOVE | TABS_ACTIVATE | TABS_MOVE

export type TABS_ADD = {
  type: "TABS_ADD",
  id: string,
  data?: $Shape<SearchState>
}
export type TABS_REMOVE = {type: "TABS_REMOVE", id: string}
export type TABS_ACTIVATE = {type: "TABS_ACTIVATE", id: string}
export type TABS_MOVE = {type: "TABS_MOVE", id: string, index: number}
