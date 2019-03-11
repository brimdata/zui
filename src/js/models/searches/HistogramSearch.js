/* @flow */

import type {Dispatch} from "../../reducers/types"
import BaseSearch from "./BaseSearch"
import countByTimeInterval from "../../lib/countByTimeInterval"
import countByTimeReceiver from "../../receivers/countByTimeReceiver"

const BOOM_INTERVALS = {
  millisecond: "ms",
  second: "sec",
  minute: "min",
  hour: "hr",
  day: "day"
}

export default class HistogramSearch extends BaseSearch {
  getProgram() {
    const {number, unit} = countByTimeInterval(this.getSpan())

    return (
      this.program +
      ` | every ${number}${BOOM_INTERVALS[unit]} count() by _path`
    )
  }

  getReceivers(dispatch: Dispatch) {
    return [countByTimeReceiver(dispatch)]
  }
}
