/* @flow */
import type {SearchState} from "../search/types"
import type {TABS_ACTIVATE, TABS_ADD, TABS_REMOVE} from "./types"

export default {
  add: (id: string, data?: $Shape<SearchState>): TABS_ADD => ({
    type: "TABS_ADD",
    id,
    data
  }),
  remove: (id: string): TABS_REMOVE => ({type: "TABS_REMOVE", id}),
  activate: (id: string): TABS_ACTIVATE => ({type: "TABS_ACTIVATE", id}),
  move: (from: number, to: number) => ({type: "TABS_MOVE", from, to})
}
