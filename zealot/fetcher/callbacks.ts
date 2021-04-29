import {ZealotPayload} from "../types"
import * as lake from "../lake"
import {createRecordsCallback, RecordsCallbackArgs} from "./records_callback"

export function createCallbacks() {
  const callbacks = new Map()
  return {
    add: function(name: string, cb: Function) {
      callbacks.set(name, cb)
      return this
    },
    emit: (name: string, payload: ZealotPayload) => {
      const cb = callbacks.get(name)
      if (cb) cb(payload)
    },
    start(cb: (payload: lake.TaskStart) => void) {
      return this.add("TaskStart", cb)
    },
    end(cb: (payload: lake.TaskEnd) => void) {
      return this.add("TaskEnd", cb)
    },
    records(cb: (args: RecordsCallbackArgs) => void) {
      return this.add("SearchRecords", createRecordsCallback(cb))
    },
    stats(cb: (payload: lake.SearchStats) => void) {
      return this.add("SearchStats", cb)
    },
    warnings(cb: (payload: lake.SearchWarnings) => void) {
      return this.add("SearchWarning", cb)
    },
    error(cb: (payload: Error) => void) {
      return this.add("error", cb)
    }
  }
}
