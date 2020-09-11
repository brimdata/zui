import {
  LOG_DETAIL_BACK,
  LOG_DETAIL_CLEAR,
  LOG_DETAIL_FORWARD,
  LOG_DETAIL_PUSH,
  LogDetails
} from "./types"
import {RecordData} from "../../types/records"

export default {
  push: (record: RecordData): LOG_DETAIL_PUSH => ({
    type: "LOG_DETAIL_PUSH",
    record
  }),

  back: (): LOG_DETAIL_BACK => ({
    type: "LOG_DETAIL_BACK"
  }),

  forward: (): LOG_DETAIL_FORWARD => ({
    type: "LOG_DETAIL_FORWARD"
  }),

  update: (updates: Partial<LogDetails>) => ({
    type: "LOG_DETAIL_UPDATE",
    updates
  }),

  clear: (): LOG_DETAIL_CLEAR => ({
    type: "LOG_DETAIL_CLEAR"
  })
}
