/* @flow */

import type {Descriptors} from "../../types"
import type {RecordData} from "../../types/records"
import type {SearchStats, SearchStatus} from "../../types/searches"

type EventNames =
  | "stats"
  | "status"
  | "end"
  | "start"
  | "error"
  | "abort"
  | "warnings"
  | number

export function createResponse() {
  // Allow for multiple callbacks on one event
  const callbacks = new Map<EventNames, Function>()
  return {
    chan(num: number, func: (RecordData[], Descriptors) => void) {
      callbacks.set(num, func)
      return this
    },
    stats(func: (SearchStats) => void) {
      callbacks.set("stats", func)
      return this
    },
    status(func: (SearchStatus) => void) {
      callbacks.set("status", func)
      return this
    },
    end(func: (number) => void) {
      callbacks.set("end", func)
      return this
    },
    start(func: (number) => void) {
      callbacks.set("start", func)
      return this
    },
    error(func: (string) => void) {
      callbacks.set("error", func)
      return this
    },
    abort(func: () => void) {
      callbacks.set("abort", func)
      return this
    },
    warnings(func: (string) => void) {
      callbacks.set("warnings", func)
      return this
    },
    emit(event: EventNames, ...data: *) {
      let func = callbacks.get(event)
      if (func) func(...data)
      return this
    }
  }
}
