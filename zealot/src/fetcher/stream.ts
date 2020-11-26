import {createCallbacks} from "./callbacks"
import {ZCallbacks, ZIterator} from "../types"
import * as zjson from "../zjson"
import * as zng from "../zng"

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
    records: async (): Promise<zng.Record[]> => {
      let records: zjson.Items = []
      for await (let payload of iterator) {
        if (payload.type === "SearchRecords") {
          records = records.concat(payload.records)
        }
      }
      return zng.createRecords(records)
    },
    callbacks: () => {
      const cbs = createCallbacks()
      emitCallbacks(iterator, cbs)
      return cbs
    }
  }
}
