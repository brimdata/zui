/* @flow */

import type {DateTuple} from "../../lib/TimeWindow"
import type {Dispatch} from "../../reducers/types"

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

  getReceivers(_dipatch: Dispatch) {
    return []
  }
}
