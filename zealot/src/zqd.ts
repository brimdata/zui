import {Ts} from "./types"
import * as zjson from "./zjson"

export type Payload =
  | SearchRecords
  | SearchWarnings
  | SearchStats
  | TaskStart
  | TaskEnd
  | PcapPostStatus

export type SearchRecords = {
  type: "SearchRecords"
  records: zjson.Items
  channel_id: number
}

export type SearchWarnings = {
  type: "SearchWarnings"
  warnings: string[]
}

export type SearchStats = {
  type: "SearchStats"
  update_time: number
  start_time: number
  bytes_read: number
}

export type TaskStart = {
  type: "TaskStart"
  task_id: number
}

export type TaskEnd = {
  type: "TaskEnd"
  task_id: number
}

export type PcapPostStatus = {
  type: "PcapPostStatus"
  snapshot_count: number
  start_time: Ts
  update_time: Ts
  pcap_total_size: number
  pcap_read_size: number
}
