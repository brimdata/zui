/* @flow */

import type {DateTuple} from "../../lib/TimeWindow"
import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import {setBoomSearchStatus} from "../../actions/boomSearches"
import statsReceiver from "../../receivers/statsReceiver"

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
    handler
      .each(statsReceiver(name, dispatch))
      .done(() => dispatch(setBoomSearchStatus(name, "SUCCESS")))
      .error(() => dispatch(setBoomSearchStatus(name, "ERROR")))
      .abort(() => dispatch(setBoomSearchStatus(name, "ABORTED")))
  }
}
