/* @flow */
import {throttle} from "lodash"

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {BoomPayload} from "../../services/BoomClient/types"
import type {Dispatch} from "../../state/types"
import type {SearchCallbackMap, SearchTemplate} from "../../searches/types"
import {
  appendViewerRecords,
  setViewerStatus,
  updateViewerColumns
} from "../../state/viewer/actions"
import brim from "../../brim"

export default function(
  dispatch: Dispatch,
  _search: SearchTemplate
): SearchCallbackMap {
  let buffer = brim.flatRecordsBuffer()

  function dispatchResults() {
    dispatch(appendViewerRecords(buffer.records()))
    dispatch(updateViewerColumns(buffer.columns()))
    buffer.clear()
  }

  let dispatchResultsSteady = throttle(dispatchResults, 100, {leading: false})
  let count = 0

  function each(payload: BoomPayload) {
    switch (payload.type) {
      case "SearchRecords":
        buffer.add(payload.channel_id.toString(), payload.records)
        count += payload.records.length
        dispatchResultsSteady()
        break
      case "SearchEnd":
        dispatchResultsSteady.cancel()
        dispatchResults()

        if (count === PER_PAGE) {
          dispatch(setViewerStatus("INCOMPLETE"))
        } else if (count === ANALYTIC_MAX_RESULTS) {
          dispatch(setViewerStatus("LIMIT"))
        } else {
          dispatch(setViewerStatus("COMPLETE"))
        }
        break
    }
  }

  function abort() {
    dispatchResultsSteady.cancel()
  }

  function error() {
    dispatchResultsSteady.cancel()
  }

  return {
    each,
    error,
    abort
  }
}
