

import { createResponse } from "./response";
import brim from "../../brim";
import whenIdle from "../../lib/whenIdle";

function abortError(e) {
  return /user aborted/i.test(e.message);
}

export function handle(request: any) {
  const response = createResponse();
  const buffer = brim.flatRecordsBuffer();
  let count = 0;

  function flushBuffer() {
    for (let chan of buffer.channels()) {
      if (!chan.empty()) {
        response.emit(chan.id(), chan.records(), buffer.columns());
        chan.clear();
      }
    }
  }

  let flushBufferLazy = whenIdle(flushBuffer);

  function started({
    task_id
  }) {
    response.emit("start", task_id);
    response.emit("status", "FETCHING");
  }

  function records(payload) {
    count += payload.records.length;
    buffer.add(payload.channel_id, payload.records);
    flushBufferLazy();
  }

  function errored(e) {
    flushBufferLazy.cancel();
    response.emit("status", "ERROR");
    response.emit("error", e);
  }

  function warnings(payload) {
    response.emit("warnings", payload.warning);
  }

  const promise = new Promise<any>((resolve, reject) => {
    request.then(stream => {
      stream.callbacks().start(started).records(records).warnings(warnings).error((...args) => {
        errored(...args);
        reject(...args);
      }).end(({
        id,
        error
      }) => {
        if (error) {
          errored(error);
          reject(error);
        } else {
          flushBuffer();
          response.emit("status", "SUCCESS");
          response.emit("end", id, count);
          resolve();
        }
      });
    }).catch(e => {
      if (abortError(e)) {
        resolve();
      } else {
        errored(e);
        reject(e);
      }
    });
  });

  return { response, promise };
}