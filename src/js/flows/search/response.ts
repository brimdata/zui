import {Descriptors} from "../../types"
import {RecordData} from "../../types/records"
import {SearchStats, SearchStatus} from "../../types/searches"

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
    chan(num: number, func: (arg0: RecordData[], arg1: Descriptors) => void) {
      callbacks.set(num, func)
      return this
    },
    stats(func: (arg0: SearchStats) => void) {
      callbacks.set("stats", func)
      return this
    },
    status(func: (arg0: SearchStatus) => void) {
      callbacks.set("status", func)
      return this
    },
    end(func: (arg0: number) => void) {
      callbacks.set("end", func)
      return this
    },
    start(func: (arg0: number) => void) {
      callbacks.set("start", func)
      return this
    },
    error(func: (arg0: string) => void) {
      callbacks.set("error", func)
      return this
    },
    abort(func: () => void) {
      callbacks.set("abort", func)
      return this
    },
    warnings(func: (arg0: string) => void) {
      callbacks.set("warnings", func)
      return this
    },
    emit(event: EventNames, ...data: any) {
      const func = callbacks.get(event)
      if (func) func(...data)
      return this
    }
  }
}

export type SearchResponse = ReturnType<typeof createResponse>
