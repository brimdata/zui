/* @flow */

import type {Dispatch} from "../../state/reducers/types"
import {addHeadProc} from "../../lib/Program"
import {resultsHandlers} from "../../searches/resultsHandlers"
import BaseSearch from "./BaseSearch"
import Handler from "../../BoomClient/lib/Handler"

export const ANALYTIC_MAX_RESULTS = 10000

export default class AnalyticSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, ANALYTIC_MAX_RESULTS)
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    let handlers = resultsHandlers(dispatch)

    handler.each(handlers.each).abort(handlers.abort)
  }
}
