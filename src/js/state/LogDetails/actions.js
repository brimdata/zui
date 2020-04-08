/* @flow */

import type {
  LOG_DETAIL_BACK,
  LOG_DETAIL_FORWARD,
  LOG_DETAIL_PUSH,
  LogDetails
} from "./types"
import type {RecordData} from "../../types/records"

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

  update: (updates: $Shape<LogDetails>) => ({
    type: "LOG_DETAIL_UPDATE",
    updates
  })
}
