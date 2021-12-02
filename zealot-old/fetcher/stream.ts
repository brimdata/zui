import {decode, zed, zjson} from "@brimdata/zealot"
import {ZIterator} from "../types"
import {Callbacks} from "./callbacks"

async function emitCallbacks(iterator: ZIterator, callbacks: Callbacks) {
  try {
    let hasStarted = false
    for await (const payload of iterator) {
      if (!hasStarted) {
        callbacks.emit("QueryStart")
        hasStarted = true
      }
      callbacks.emit(payload.kind, payload.value)
    }
  } catch (e) {
    callbacks.emit("error", e)
  } finally {
    callbacks.emit("QueryEnd")
  }
}

export function createStream(
  iterator: ZIterator,
  origResp: Response | XMLHttpRequest
) {
  return {
    origResp,
    [Symbol.asyncIterator]: () => iterator,
    array: async () => {
      const all = []
      for await (const payload of iterator) {
        all.push(payload)
      }
      return all
    },
    records: async (): Promise<zed.Record[]> => {
      let records: zjson.RootRecord[] = []
      for await (let payload of iterator) {
        if (payload.kind === "Object") {
          records = records.concat(payload.value)
        }
      }
      return decode(records)
    },
    callbacks: () => {
      const cbs = new Callbacks()
      emitCallbacks(iterator, cbs)
      return cbs
    }
  }
}
