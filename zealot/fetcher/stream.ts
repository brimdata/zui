import {ZealotContext, zed} from "zealot"
import {RootRecord} from "zealot/zjson"
import {ZIterator} from "../types"
import {Callbacks} from "./callbacks"

async function emitCallbacks(iterator: ZIterator, callbacks: Callbacks) {
  try {
    for await (const payload of iterator) {
      callbacks.emit(payload.kind, payload.value)
    }
  } catch (e) {
    callbacks.emit("error", e)
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
      let records: RootRecord[] = []
      for await (let payload of iterator) {
        if (payload.kind === "Object") {
          records = records.concat(payload.value)
        }
      }
      return ZealotContext.decode(records)
    },
    callbacks: () => {
      const cbs = new Callbacks()
      emitCallbacks(iterator, cbs)
      return cbs
    }
  }
}
