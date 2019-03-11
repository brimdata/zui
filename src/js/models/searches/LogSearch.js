/* @flow */

import type {Dispatch} from "../../reducers/types"
import {PER_PAGE} from "../../reducers/logViewer"
import {addHeadProc} from "../../lib/Program"
import BaseSearch from "./BaseSearch"
import logsReceiver from "../../receivers/logsReceiver"
import pageReceiver from "../../receivers/pageReceiver"

export default class LogSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, PER_PAGE)
  }

  getReceivers(dispatch: Dispatch) {
    return [pageReceiver(dispatch, PER_PAGE), logsReceiver(dispatch)]
  }
}
