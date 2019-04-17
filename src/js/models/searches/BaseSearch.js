/* @flow */

import type {DateTuple} from "../../lib/TimeWindow"
import type {Dispatch} from "../../state/reducers/types"
import type {Payload} from "../../types/payloads"
import {setBoomSearchStats, setBoomSearchStatus} from "../../state/actions"
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
    const name = this.getName()

    function boomTime({sec, ns}) {
      let flt = sec + ns / 1e9
      return flt
    }

    handler
      .each((payload: Payload) => {
        if (payload.type === "SearchStats") {
          const startTime = boomTime(payload.start_time)
          const updateTime = boomTime(payload.update_time)
          dispatch(
            setBoomSearchStats(name, {
              startTime,
              updateTime,
              bytesMatched: payload.stats.bytes_matched,
              bytesRead: payload.stats.bytes_read,
              tuplesMatched: payload.stats.tuples_matched,
              tuplesRead: payload.stats.tuples_read
            })
          )
        }
      })
      .done(() => dispatch(setBoomSearchStatus(name, "SUCCESS")))
      .error(() => dispatch(setBoomSearchStatus(name, "ERROR")))
      .abort(() => dispatch(setBoomSearchStatus(name, "ABORTED")))
  }
}
