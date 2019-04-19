/* @flow */

import {addHeadProc} from "../../lib/Program"
import BaseSearch from "./BaseSearch"

export const ANALYTIC_MAX_RESULTS = 10000

export default class AnalyticSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, ANALYTIC_MAX_RESULTS)
  }
}
