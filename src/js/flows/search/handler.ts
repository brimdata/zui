import {SearchResponse} from "./response"
import whenIdle from "../../lib/whenIdle"
import {
  createRecordCallback,
  RecordCallbackRet
} from "zealot-old/fetcher/records-callback"
import {ZResponse} from "../../../../zealot-old/types"
import {isEqual} from "lodash"

function abortError(e) {
  return (
    isEqual(e, {error: "context canceled"}) || /user aborted/i.test(e.message)
  )
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
        // NOTE: by clearing callbacks here, consumers of search should expect
        // the aborted status event to be the last actionable emission
        response.clearCallbacks()
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
        stream
          .callbacks()
          .start(() => {
            response.emit("start")
            response.emit("status", "FETCHING")
          })
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
          .warning((pl) => response.emit("warning", pl.warning))
          .error(errored)
          .internalError(errored)
          .end(() => {
            flushBuffer()
            response.emit("end")
            if (!isErrSet) {
              response.emit("status", "SUCCESS")
              setTimeout(resolve)
            }
          })
      })
      .catch(errored)
  })

  return {response, promise}
}
