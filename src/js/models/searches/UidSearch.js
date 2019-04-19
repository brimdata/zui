/* @flow */

import type {Span} from "../../BoomClient/types"
import {addHeadProc} from "../../lib/Program"
import BaseSearch from "./BaseSearch"
import Log from "../Log"

export default class UidSearch extends BaseSearch {
  log: Log

  constructor(log: Log, span: Span) {
    super(log.correlationId(), span)
    this.log = log
  }

  getProgram() {
    return addHeadProc(this.program, 500)
  }
}
