/* @flow */

import type {ScrollPosition, SearchRecord} from "../../types"
import type {Ts} from "../../brim"

export type HistoryState = {
  position: number,
  entries: SearchRecord[]
}

export type HistoryAction =
  | HISTORY_BACK
  | HISTORY_FORWARD
  | HISTORY_PUSH
  | HISTORY_CLEAR
  | HISTORY_UPDATE

export type HISTORY_BACK = {type: "HISTORY_BACK"}

export type HISTORY_FORWARD = {type: "HISTORY_FORWARD"}

export type HISTORY_PUSH = {type: "HISTORY_PUSH", entry: SearchRecord, ts: Ts}

export type HISTORY_CLEAR = {type: "HISTORY_CLEAR"}

export type HISTORY_UPDATE = {type: "HISTORY_UPDATE", scrollPos: ScrollPosition}
