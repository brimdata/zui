/* @flow */
import type {$Record, RecordData} from "../types/records"
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
  }
}
