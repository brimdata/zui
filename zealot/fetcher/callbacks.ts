import * as lake from "../lake"
import {ZealotPayloadValue} from "../types"

type EventName =
  | "QueryChannelSet"
  | "QueryChannelEnd"
  | "QueryRecord"
  | "QueryStats"
  | "QueryWarning"
  | "QueryError"
  | "error"

export class Callbacks {
  private callbacks: Map<EventName, (ZealotPayloadValue) => void>
  constructor() {
    this.callbacks = new Map()
  }

  add(name: EventName, cb: (args: ZealotPayloadValue) => void) {
    this.callbacks.set(name, cb)
    return this
  }
  emit(name: EventName | "Object", payload: ZealotPayloadValue) {
    // backend sends kind: "Object" for records, swap that name for the more
    // meaningful "QueryRecord" event name here
    if (name === "Object") name = "QueryRecord"
    const cb = this.callbacks.get(name)
    if (cb) cb(payload)
  }
  channelSet(cb: (payload: lake.QueryChannelSetValue) => void) {
    return this.add("QueryChannelSet", cb)
  }
  channelEnd(cb: (payload: lake.QueryChannelEndValue) => void) {
    return this.add("QueryChannelEnd", cb)
  }
  record(cb: (args: lake.QueryRecordValue) => void) {
    return this.add("QueryRecord", cb)
  }
  stats(cb: (payload: lake.QueryStatsValue) => void) {
    return this.add("QueryStats", cb)
  }
  warning(cb: (payload: lake.QueryWarningValue) => void) {
    return this.add("QueryWarning", cb)
  }
  error(cb: (payload: lake.QueryErrorValue) => void) {
    return this.add("QueryError", cb)
  }
  internalError(cb: (err: Error) => void) {
    this.callbacks.set("error", cb)
    return this
  }
}
