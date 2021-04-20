import {SerializedZedRecord} from "zealot/zed"
import {SearchStatus} from "../../types/searches"

export type LogDetailsState = {
  entries: LogDetails[]
  position: number
}

export type LogDetails = {
  log: SerializedZedRecord
  uidLogs: SerializedZedRecord[]
  uidStatus: SearchStatus
}

export type LogDetailsAction =
  | LOG_DETAIL_PUSH
  | LOG_DETAIL_BACK
  | LOG_DETAIL_FORWARD
  | LOG_DETAIL_UPDATE
  | LOG_DETAIL_CLEAR

export type LOG_DETAIL_PUSH = {
  type: "LOG_DETAIL_PUSH"
  record: SerializedZedRecord
}

export type LOG_DETAIL_UPDATE = {
  type: "LOG_DETAIL_UPDATE"
  updates: Partial<LogDetails>
}

export type LOG_DETAIL_BACK = {
  type: "LOG_DETAIL_BACK"
}

export type LOG_DETAIL_FORWARD = {
  type: "LOG_DETAIL_FORWARD"
}

export type LOG_DETAIL_CLEAR = {
  type: "LOG_DETAIL_CLEAR"
}
