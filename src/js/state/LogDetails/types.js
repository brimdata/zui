/* @flow */

import type {RecordData} from "../../types/records"

export type LogDetailsState = {
  entries: LogDetails[],
  position: number,
  prevPosition: number
}

export type LogDetails = {
  log: RecordData,
  uidLogs: RecordData[]
}

export type LogDetailsAction =
  | LOG_DETAIL_PUSH
  | LOG_DETAIL_BACK
  | LOG_DETAIL_FORWARD

export type LOG_DETAIL_PUSH = {
  type: "LOG_DETAIL_PUSH",
  record: RecordData
}

export type LOG_DETAIL_BACK = {
  type: "LOG_DETAIL_BACK"
}

export type LOG_DETAIL_FORWARD = {
  type: "LOG_DETAIL_FORWARD"
}
