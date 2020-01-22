/* @flow */
import type {$Record} from "../types/records"
import Log from "../models/Log"

export default {
  recordToLog(record: $Record) {
    // $FlowFixMe
    return new Log(record.values(), record.columns())
  }
}
