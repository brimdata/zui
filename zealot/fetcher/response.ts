import { createIterator } from "./iterator.ts";
import { createCallbacks } from "./callbacks.ts";
import { Record, ZCallbacks, ZIterator } from "../types.ts";
import { FetchArgs } from "./fetcher.ts";

async function emitCallbacks(iterator: ZIterator, callbacks: ZCallbacks) {
  try {
    for await (const payload of iterator) callbacks.emit(payload.type, payload);
  } catch (e) {
    callbacks.emit("error", e);
  }
}

export function createResponse(resp: Response, abortCtl: AbortController, args: FetchArgs) {
  return {
    origResp: resp,
    abort: () => abortCtl.abort(),
    iterator: () => createIterator(resp, args),
    array: async () => {
      const all = [];
      for await (const payload of createIterator(resp, args)) {
        all.push(payload);
      }
      return all;
    },
    records: async () => {
      let records: Record[] = [];
      for await (let payload of createIterator(resp, args)) {
        if (payload.type === "SearchRecords") {
          records = records.concat(payload.records);
        }
      }
      return records;
    },
    callbacks: () => {
      const cbs = createCallbacks();
      const iterator = createIterator(resp, args);
      emitCallbacks(iterator, cbs);
      return cbs;
    },
  };
}
