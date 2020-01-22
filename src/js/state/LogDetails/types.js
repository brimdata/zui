/* @flow */

import type {Descriptor, Tuple} from "../../types"
import Log from "../../models/Log"

export type LogDetailsState = {
  logs: Log[],
  position: number,
  prevPosition: number
}

export type LogDetailsAction =
  | LOG_DETAIL_PUSH
  | LOG_DETAIL_BACK
  | LOG_DETAIL_FORWARD

export type LOG_DETAIL_PUSH = {
  type: "LOG_DETAIL_PUSH",
  tuple: Tuple,
  descriptor: Descriptor
}

export type LOG_DETAIL_BACK = {
  type: "LOG_DETAIL_BACK"
}

export type LOG_DETAIL_FORWARD = {
  type: "LOG_DETAIL_FORWARD"
}
