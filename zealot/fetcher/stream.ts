import {ZealotContext, zed} from "zealot"
import {RootRecord} from "zealot/zjson"
import {ZCallbacks, ZIterator} from "../types"
import {createCallbacks} from "./callbacks"

async function emitCallbacks(iterator: ZIterator, callbacks: ZCallbacks) {
  try {
    for await (const payload of iterator) {
      callbacks.emit(payload.type, payload)
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
        if (payload.type === "SearchRecords") {
          records = records.concat(payload.records)
        }
      }
      return ZealotContext.decode(records)
    },
    callbacks: () => {
      const cbs = createCallbacks()
      emitCallbacks(iterator, cbs)
      return cbs
    }
  }
}
