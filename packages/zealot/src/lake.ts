import {Ts} from "./types"
import * as zjson from "./zjson"

export type Payload =
  | QueryRecordPayload
  | QueryWarningPayload
  | QueryStatsPayload
  | QueryChannelSetPayload
  | QueryChannelEndPayload
  | QueryErrorPayload

export type PayloadValue =
  | QueryRecordValue
  | QueryWarningValue
  | QueryStatsValue
  | QueryChannelSetValue
  | QueryChannelEndValue
  | QueryErrorValue

export type QueryRecordPayload = {
  kind: "Object"
  value: QueryRecordValue
}
export type QueryRecordValue = zjson.RootRecord

export type QueryWarningPayload = {
  kind: "QueryWarning"
  value: QueryWarningValue
}
export type QueryWarningValue = {
  warning: string
}

export type QueryStatsPayload = {
  kind: "QueryStats"
  value: QueryStatsValue
}
export type QueryStatsValue = {
  update_time: Ts
  start_time: Ts
  bytes_read: number
  bytes_matched: number
  records_read: number
  records_matched: number
}

export type QueryChannelSetPayload = {
  kind: "QueryChannelSet"
  value: QueryChannelSetValue
}
export type QueryChannelSetValue = {
  channel_id: number
}

export type QueryChannelEndPayload = {
  kind: "QueryChannelEnd"
  value: QueryChannelEndValue
}
export type QueryChannelEndValue = {
  channel_id: number
}

export type QueryErrorPayload = {
  kind: "QueryError"
  value: QueryErrorValue
}
export type QueryErrorValue = {
  error: unknown
}
