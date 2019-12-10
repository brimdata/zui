/* @flow */
import type {BoomPayload} from "../services/BoomClient/types"
import type {Dispatch} from "../state/types"
import type {SearchCallbackMap, SearchTemplate} from "./types"
import {setSearchStats, setSearchStatus} from "../state/searches/actions"
import ErrorFactory from "../models/ErrorFactory"
import brim from "../brim"
import notice from "../state/notice"

export default function(
  dispatch: Dispatch,
  search: SearchTemplate
): SearchCallbackMap {
  let name = search.name

  function each(payload: BoomPayload) {
    switch (payload.type) {
      case "SearchStats":
        dispatch(
          setSearchStats(name, {
            currentTs: brim.time(payload.current_ts).toFracSec(),
            startTime: brim.time(payload.start_time).toFracSec(),
            updateTime: brim.time(payload.update_time).toFracSec(),
            bytesMatched: payload.bytes_matched,
            bytesRead: payload.bytes_read,
            tuplesMatched: payload.records_matched,
            tuplesRead: payload.records_read
          })
        )
        break
      case "SearchEnd":
        dispatch(setSearchStatus(name, "SUCCESS"))
        break
      case "TaskEnd":
        if (payload.error) {
          dispatch(setSearchStatus(name, "ERROR"))
          dispatch(notice.set(ErrorFactory.create(payload.error)))
          break
        }
    }
  }

  function abort() {
    dispatch(setSearchStatus(name, "ABORTED"))
  }

  function error() {
    dispatch(setSearchStatus(name, "ERROR"))
  }

  return {
    each,
    error,
    abort
  }
}
