import {Ts} from "./types"
import * as zjson from "./zjson"

export type Payload =
  | SearchRecords
  | SearchWarnings
  | SearchStats
  | SearchEnd
  | TaskStart
  | TaskEnd

export type SearchRecords = {
  type: "SearchRecords"
  records: zjson.RootRecord[]
  channel_id: number
}

export type SearchWarnings = {
  type: "SearchWarnings"
  warnings: string[]
}

export type SearchStats = {
  type: "SearchStats"
  update_time: Ts
  start_time: Ts
  bytes_read: number
  bytes_matched: number
  records_read: number
  records_matched: number
}

export type SearchEnd = {
  type: "SearchEnd"
  channel_id: number
  reason: string
}

export type TaskStart = {
  type: "TaskStart"
  task_id: number
}

export type TaskEnd = {
  type: "TaskEnd"
  task_id: number
}
