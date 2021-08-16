import {SearchResponse} from "./response"
import whenIdle from "../../lib/whenIdle"
import {
  createRecordCallback,
  RecordCallbackRet
} from "zealot/fetcher/records-callback"
import {ZResponse} from "../../../../zealot/types"

function abortError(e) {
  return /user aborted/i.test(e.message)
}

export function handle(request: Promise<ZResponse>) {
  const response = new SearchResponse()
  const channels = new Map<number, RecordCallbackRet>()
  let currentChannel = null
  const promise = new Promise<void>((resolve, reject) => {
    function flushBuffer() {
      for (const [id, data] of channels) {
        response.emit(id, data)
      }
      channels.clear()
    }

    const flushBufferLazy = whenIdle(flushBuffer)

    let isErrSet = false
    function errored(e) {
      flushBufferLazy.cancel()
      if (abortError(e)) {
        response.emit("status", "ABORTED")
        resolve()
      } else {
        isErrSet = true
        response.emit("status", "ERROR")
        response.emit("error", e)
        reject(e)
      }
    }

    const recordCb = createRecordCallback()

    request
      .then((stream) => {
        response.emit("start")
        response.emit("status", "FETCHING")
        stream
          .callbacks()
          .channelSet(({channel_id}) => {
            currentChannel = channel_id
          })
          .record((rec) => {
            if (currentChannel === null)
              throw new Error("record received before channel was set")
            channels.set(currentChannel, recordCb(rec, currentChannel))
            flushBufferLazy()
          })
          .channelEnd(({channel_id}) => {
            flushBuffer()
            response.emit("chan-end", channel_id)
          })
          .warning(({warning}) => response.emit("warning", warning))
          .error(errored)
          .internalError(errored)
      })
      .catch(errored)
      .finally(() => {
        if (!isErrSet) {
          response.emit("status", "SUCCESS")
          setTimeout(resolve)
        }
      })
  })

  return {response, promise}
}
