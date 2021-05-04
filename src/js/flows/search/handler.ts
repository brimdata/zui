import {SearchResponse} from "./response"
import whenIdle from "../../lib/whenIdle"
import {RecordsCallbackArgs} from "zealot/fetcher/records_callback"

function abortError(e) {
  return /user aborted/i.test(e.message)
}

export function handle(request: any) {
  const response = new SearchResponse()
  const channels = new Map<number, RecordsCallbackArgs>()
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
          .records((args: RecordsCallbackArgs) => {
            channels.set(args.channel, args)
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
