/* @flow */
import type {$Record, RecordData} from "../types/records"
import brim, {type Ts} from "./"
import Log from "../models/Log"

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
        .addDur((span.dur: Ts))
        .toTs()
      space = {...space, min_time: span.ts, max_time: end}
      delete space.span
    }
    return space
  }
}
