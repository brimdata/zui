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

export class SearchResponse {
  callbacks: Map<EventNames, Function>

  constructor() {
    this.callbacks = new Map<EventNames, Function>()
  }

  chan(num: number, func: (records: any, schemas: any) => void) {
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
  end(func: (id: number) => void) {
    this.callbacks.set("end", func)
    return this
  }
  start(func: (arg0: number) => void) {
    this.callbacks.set("start", func)
    return this
  }
  error(func: (arg0: string) => void) {
    this.callbacks.set("error", func)
    return this
  }
  abort(func: () => void) {
    this.callbacks.set("abort", func)
    return this
  }
  warnings(func: (arg0: string) => void) {
    this.callbacks.set("warnings", func)
    return this
  }
  emit(event: EventNames, ...data: any) {
    const func = this.callbacks.get(event)
    if (func) func(...data)
    return this
  }
}
