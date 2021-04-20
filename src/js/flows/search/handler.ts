import {SearchResponse} from "./response"
import whenIdle from "../../lib/whenIdle"
import {DecodedZJSON} from "zealot/zed/zjson"
import {RecordsCallbackArgs} from "zealot/fetcher/records_callback"

function abortError(e) {
  return /user aborted/i.test(e.message)
}

export function handle(request: any) {
  const response = new SearchResponse()
  const channels = new Map<number, DecodedZJSON>()
  const promise = new Promise<void>((resolve, reject) => {
    function flushBuffer() {
      for (const [id, data] of channels) {
        response.emit(id, data)
      }
      channels.clear()
    }

    const flushBufferLazy = whenIdle(flushBuffer)

    function errored(e) {
      flushBufferLazy.cancel()
      if (abortError(e)) {
        resolve()
      } else {
        response.emit("status", "ERROR")
        response.emit("error", e)
        reject(e)
      }
    }
    request
      .then((stream) => {
        stream
          .callbacks()
          .start(({task_id}) => {
            response.emit("start", task_id)
            response.emit("status", "FETCHING")
          })
          .records(({channel, rows, schemas, context}: RecordsCallbackArgs) => {
            channels.set(channel, {rows, schemas, context})
            flushBufferLazy()
          })
          .end(({id, error}) => {
            if (error) return errored(error)
            flushBuffer()
            response.emit("status", "SUCCESS")
            response.emit("end", id)
            setTimeout(resolve)
          })
          .warnings(({warning}) => response.emit("warnings", warning))
          .error(errored)
      })
      .catch(errored)
  })

  return {response, promise}
}
