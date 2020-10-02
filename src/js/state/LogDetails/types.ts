import {zng} from "zealot"
import {SearchStatus} from "../../types/searches"

export type LogDetailsState = {
  entries: LogDetails[]
  position: number
  prevPosition: number
}

export type LogDetails = {
  log: zng.SerializedRecord
  uidLogs: zng.SerializedRecord[]
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
  record: zng.SerializedRecord
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
