/* @flow */

import {throttle} from "lodash"

import type {BoomPayload} from "../../BoomClient/types"
import type {DateTuple} from "../../lib/TimeWindow"
import type {Dispatch} from "../../state/reducers/types"
import {accumResults} from "../../lib/accumResults"
import {
  appendSearchResults,
  setSearchStats,
  setSearchStatus
} from "../../state/searches/actions"
import {boomTime} from "../../lib/Time"
import Handler from "../../BoomClient/lib/Handler"

export default class BaseSearch {
  program: string
  span: DateTuple

  constructor(program: string, span: DateTuple) {
    this.program = program
    this.span = span
  }

  getName() {
    return this.constructor.name
  }

  getProgram() {
    return this.program
  }

  getSpan() {
    return this.span
  }

  receiveData(_handler: Handler, _dispatch: Dispatch) {}

  receiveStats(handler: Handler, dispatch: Dispatch) {
    let name = this.getName()
    let accum = accumResults()

    function dispatchResults() {
      dispatch(appendSearchResults(name, accum.getResults()))
      accum.clearTuples()
    }

    let dispatchResultsSteady = throttle(dispatchResults, 100, {leading: false})

    handler
      .each((payload: BoomPayload) => {
        switch (payload.type) {
          case "SearchDescriptors":
            accum.addDescriptors(payload.descriptors)
            break
          case "SearchTuples":
            accum.addTuples(payload.tuples)
            dispatchResultsSteady()
            break
          case "SearchStats":
            dispatch(
              setSearchStats(name, {
                startTime: boomTime(payload.start_time),
                updateTime: boomTime(payload.update_time),
                bytesMatched: payload.stats.bytes_matched,
                bytesRead: payload.stats.bytes_read,
                tuplesMatched: payload.stats.tuples_matched,
                tuplesRead: payload.stats.tuples_read
              })
            )
            break
        }
      })
      .done(() => {
        dispatchResultsSteady.cancel()
        dispatchResults()
        dispatch(setSearchStatus(name, "SUCCESS"))
      })
      .error(() => {
        dispatch(setSearchStatus(name, "ERROR"))
        dispatchResultsSteady.cancel()
        dispatchResults()
      })
      .abort(() => {
        dispatch(setSearchStatus(name, "ABORTED"))
        dispatchResultsSteady.cancel()
        dispatchResults()
      })
  }
}
