import {$Record} from "./record"
import {RecordData} from "../types/records"
import Log from "../models/Log"
import brim, {Ts} from "./"

export default {
  recordToLog(record: $Record) {
    // @ts-ignore
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
      const span = space.span
      const end = brim
        .time(span.ts)
        .addTs(span.dur as Ts)
        .toTs()
      space = {...space, min_time: span.ts, max_time: end}
      delete space.span
    }
    return space
  }
}
