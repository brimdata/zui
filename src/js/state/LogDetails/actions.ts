import {
  LOG_DETAIL_BACK,
  LOG_DETAIL_CLEAR,
  LOG_DETAIL_FORWARD,
  LOG_DETAIL_PUSH,
  LOG_DETAIL_UPDATE
} from "./types"
import {zng} from "zealot"
import {SearchStatus} from "src/js/types/searches"

export default {
  push: (record: zng.Record): LOG_DETAIL_PUSH => ({
    type: "LOG_DETAIL_PUSH",
    record: record.serialize()
  }),

  back: (): LOG_DETAIL_BACK => ({
    type: "LOG_DETAIL_BACK"
  }),

  forward: (): LOG_DETAIL_FORWARD => ({
    type: "LOG_DETAIL_FORWARD"
  }),

  updateUidLogs: (records: zng.Record[]): LOG_DETAIL_UPDATE => {
    return {
      type: "LOG_DETAIL_UPDATE",
      updates: {
        uidLogs: records.map((r) => r.serialize())
      }
    }
  },

  updateUidStatus: (uidStatus: SearchStatus): LOG_DETAIL_UPDATE => {
    return {
      type: "LOG_DETAIL_UPDATE",
      updates: {uidStatus}
    }
  },

  clear: (): LOG_DETAIL_CLEAR => ({
    type: "LOG_DETAIL_CLEAR"
  })
}
