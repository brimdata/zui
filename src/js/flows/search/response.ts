import {RecordCallbackRet} from "zealot-old/fetcher/records-callback"
import {SearchStats, SearchStatus} from "../../types/searches"

type EventNames =
  | "start"
  | "end"
  | "stats"
  | "status"
  | "chan-end"
  | "error"
  | "abort"
  | "warning"
  | number

export class SearchResponse {
  callbacks: Map<EventNames, Function>

  constructor() {
    this.callbacks = new Map<EventNames, Function>()
  }

  clearCallbacks() {
    this.callbacks.clear()
  }
  chan(num: number, func: (data: RecordCallbackRet) => void) {
    this.callbacks.set(num, func)
    return this
  }
  stats(func: (arg0: SearchStats) => void) {
    this.callbacks.set("stats", func)
    return this
  }
  status(func: (arg0: SearchStatus) => void) {
    this.callbacks.set("status", func)
    return this
  }
  start(func: () => void) {
    this.callbacks.set("start", func)
    return this
  }
  end(func: () => void) {
    this.callbacks.set("end", func)
    return this
  }
  chanEnd(func: (id: number) => void) {
    this.callbacks.set("chan-end", func)
    return this
  }
  error(func: (arg0: string) => void) {
    this.callbacks.set("error", func)
    return this
  }
  warning(func: (arg0: string) => void) {
    this.callbacks.set("warning", func)
    return this
  }
  emit(event: EventNames, ...data: any) {
    const func = this.callbacks.get(event)
    if (func) func(...data)
    return this
  }
}
