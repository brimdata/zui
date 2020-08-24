/* @flow */
import type {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import {globalDispatch} from "../state/GlobalContext"
import Columns from "../state/Columns"
import Current from "../state/Current"
import ErrorFactory from "../models/ErrorFactory"
import Handlers from "../state/Handlers"
import History from "../state/History"
import Investigation from "../state/Investigation"
import Notice from "../state/Notice"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import brim from "../brim"
import whenIdle from "../lib/whenIdle"

export default (
  save: Object = {history: true, investigation: true},
  ts: Date = new Date()
): Thunk => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const time = brim.time(ts)
  const tabId = Tabs.getActive(getState())

  dispatch(SearchBar.submittingSearchBar(ts))
  dispatch(Tab.computeSpan())

  const state = getState()
  const program = SearchBar.getSearchProgram(state)

  dispatch(Viewer.clear(tabId))
  dispatch(Notice.dismiss())
  if (program === "*") return Promise.resolve()

  const record = Search.getRecord(state)
  if (save.history) {
    dispatch(History.push(record, time.toTs()))
  }
  if (save.investigation) {
    globalDispatch(Investigation.push(record, time.toTs()))
  }

  const spaceId = Current.getSpaceId(getState())
  const ctl = new AbortController()
  const handle = "ArchiveSearch"
  const handler = {type: "SEARCH", abort: () => ctl.abort()}
  const buf = createRecordsBuffer((channelId, records, types) => {
    dispatch(Viewer.appendRecords(tabId, records))
    dispatch(Viewer.updateColumns(tabId, types))
    dispatch(Columns.touch(types))
  })

  dispatch(Handlers.abort(handle))
  dispatch(Handlers.register(handle, handler))

  dispatch(Viewer.clear(tabId))
  dispatch(Viewer.setStatus(tabId, "FETCHING"))
  dispatch(Viewer.setEndStatus(tabId, "FETCHING"))

  const handleError = (error) => {
    buf.cancel()
    const e = ErrorFactory.create(error)
    dispatch(SearchBar.errorSearchBarParse(e.message))
    dispatch(Viewer.setStatus(tabId, "ERROR"))
  }

  zealot.archive
    .search({patterns: [program], spaceId, signal: ctl.signal})
    .then((stream) =>
      stream
        .callbacks()
        .end(({error}) => {
          if (error) {
            handleError(error)
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
          handleError(e)
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
