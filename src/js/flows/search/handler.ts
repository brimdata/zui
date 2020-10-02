import {createResponse} from "./response"
import whenIdle from "../../lib/whenIdle"

function abortError(e) {
  return /user aborted/i.test(e.message)
}

export function handle(request: any) {
  const response = createResponse()
  const channels = new Map<number, any>()

  function flushBuffer() {
    for (const [id, data] of channels) {
      response.emit(id, data.allRecords, data.schemas)
    }
    channels.clear()
  }

  const flushBufferLazy = whenIdle(flushBuffer)

  function started({task_id}) {
    response.emit("start", task_id)
    response.emit("status", "FETCHING")
  }

  function records({channel, allRecords, schemas}) {
    channels.set(channel, {
      allRecords,
      schemas
    })
    flushBufferLazy()
  }

  function errored(e) {
    flushBufferLazy.cancel()
    response.emit("status", "ERROR")
    response.emit("error", e)
  }

  function warnings(payload) {
    response.emit("warnings", payload.warning)
  }

  const promise = new Promise<any>((resolve, reject) => {
    request
      .then((stream) => {
        stream
          .callbacks()
          .start(started)
          .records(records)
          .warnings(warnings)
          .error((e) => {
            errored(e)
            reject(e)
          })
          .end(({id, error}) => {
            if (error) {
              errored(error)
              reject(error)
            } else {
              flushBuffer()
              response.emit("status", "SUCCESS")
              response.emit("end", id)
              resolve()
            }
          })
      })
      .catch((e) => {
        if (abortError(e)) {
          resolve()
        } else {
          errored(e)
          reject(e)
        }
      })
  })

  return {response, promise}
}
