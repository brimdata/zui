import {
  Payload,
  TaskStartPayload,
  TaskEndPayload,
  SearchRecordsPayload,
  SearchWarningsPayload,
  SearchStatsPayload,
} from "../types.ts";

export function createCallbacks() {
  const callbacks = new Map();
  return {
    add: function (name: string, cb: Function) {
      callbacks.set(name, cb);
      return this;
    },
    emit: (name: string, payload: Payload) => {
      const cb = callbacks.get(name);
      if (cb) cb(payload);
    },
    start(cb: (payload: TaskStartPayload) => void) {
      return this.add("TaskStart", cb);
    },
    end(cb: (payload: TaskEndPayload) => void) {
      return this.add("TaskEnd", cb);
    },
    records(cb: (payload: SearchRecordsPayload) => void) {
      return this.add("SearchRecords", cb);
    },
    stats(cb: (payload: SearchStatsPayload) => void) {
      return this.add("SearchStats", cb);
    },
    warnings(cb: (payload: SearchWarningsPayload) => void) {
      return this.add("SearchWarning", cb);
    },
    error(cb: (payload: Error) => void) {
      return this.add("error", cb);
    },
  };
}
