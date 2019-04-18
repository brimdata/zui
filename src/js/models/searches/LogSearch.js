/* @flow */

import type {Dispatch} from "../../state/reducers/types"
import {PER_PAGE} from "../../state/reducers/logViewer"
import {addHeadProc} from "../../lib/Program"
import {resultsHandlers} from "../../searches/resultsHandlers"
import BaseSearch from "./BaseSearch"
import Handler from "../../BoomClient/lib/Handler"

export default class LogSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, PER_PAGE)
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    let handlers = resultsHandlers(dispatch)

    handler.each(handlers.each).abort(handlers.abort)
  }
}
