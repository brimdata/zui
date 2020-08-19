/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import ErrorFactory from "../models/ErrorFactory"
import Handlers from "../state/Handlers"
import Notice from "../state/Notice"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import brim from "../brim"
import whenIdle from "../lib/whenIdle"

export default (patterns: string[]): Thunk => (
  dispatch,
  getState,
  {createZealot}
) => {
  const zealot = createZealot(Current.getConnectionId(getState()))
  const spaceId = Current.getSpaceId(getState())
  const tabId = Tabs.getActive(getState())
  const ctl = new AbortController()
  const handle = "ArchiveSearch"
  const handler = {type: "SEARCH", abort: () => ctl.abort()}
  const buf = createRecordsBuffer((channelId, records, types) => {
    console.log(records, types)
    dispatch(Viewer.appendRecords(tabId, records))
    dispatch(Viewer.updateColumns(tabId, types))
  })

  dispatch(Handlers.abort(handle))
  dispatch(Handlers.register(handle, handler))

  dispatch(Viewer.clear(tabId))
  dispatch(Viewer.setStatus(tabId, "FETCHING"))
  dispatch(Viewer.setEndStatus(tabId, "FETCHING"))

  zealot.archive
    .search({patterns, spaceId, signal: ctl.signal})
    .then((stream) =>
      stream
        .callbacks()
        .end(({error}) => {
          if (error) {
            buf.cancel()
            dispatch(Notice.set(ErrorFactory.create(error)))
            dispatch(Viewer.setStatus(tabId, "ERROR"))
          } else {
            buf.flush()
            dispatch(Viewer.setStatus(tabId, "SUCCESS"))
            dispatch(Viewer.setEndStatus(tabId, "COMPLETE"))
          }
          dispatch(Handlers.remove(handle))
        })
        .records(buf.handler)
        .error((e) => {
          if (abortError(e)) return
          buf.cancel()
          dispatch(Notice.set(ErrorFactory.create(e)))
          dispatch(Viewer.setStatus(tabId, "ERROR"))
        })
        .warnings(({warnings}) => {
          dispatch(SearchBar.errorSearchBarParse(warnings[0]))
        })
    )
}

function createRecordsBuffer(fn) {
  const buffer = brim.flatRecordsBuffer()

  function flush() {
    for (let chan of buffer.channels()) {
      if (!chan.empty()) {
        fn(chan.id(), chan.records(), buffer.columns())
        chan.clear()
      }
    }
  }

  const flushWhenIdle = whenIdle(flush)

  function handler({channel_id, records}) {
    buffer.add(channel_id, records)
    flushWhenIdle()
  }

  function cancel() {
    flushWhenIdle.cancel()
  }

  return {handler, flush, cancel}
}

function abortError(e) {
  return /user aborted/i.test(e.message)
}
