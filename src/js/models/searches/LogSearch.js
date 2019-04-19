/* @flow */

import {PER_PAGE} from "../../state/reducers/logViewer"
import {addHeadProc} from "../../lib/Program"
import BaseSearch from "./BaseSearch"

export default class LogSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, PER_PAGE)
  }
}
