/* @flow */
import type {$Record} from "./record"
import type {RecordData} from "../types/records"
import Log from "../models/Log"
import brim, {type Ts} from "./"

export default {
  recordToLog(record: $Record) {
    // $FlowFixMe
    return new Log(record.values(), record.columns())
  },
  logToRecordData(log: Log): RecordData {
    return log.getFields().map(({name, type, value}) => ({
      name,
      type,
      value
    }))
  },

  spacePayloadToSpace(space: any) {
    if (space.span) {
      let span = space.span
      let end = brim
        .time(span.ts)
        .addTs((span.dur: Ts))
        .toTs()
      space = {...space, min_time: span.ts, max_time: end}
      delete space.span
    }
    return space
  }
}
