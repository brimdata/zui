/* @flow */

import type {Dispatch} from "../../state/reducers/types"
import {clearHistogram} from "../../state/actions"
import BaseSearch from "./BaseSearch"
import Handler from "../../BoomClient/lib/Handler"
import histogramInterval from "../../lib/histogramInterval"

const BOOM_INTERVALS = {
  millisecond: "ms",
  second: "sec",
  minute: "min",
  hour: "hr",
  day: "day",
  month: "month"
}

export default class HistogramSearch extends BaseSearch {
  getProgram() {
    const {number, unit} = histogramInterval(this.getSpan())

    return (
      this.program +
      ` | every ${number}${BOOM_INTERVALS[unit]} count() by _path`
    )
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    dispatch(clearHistogram())
  }
}
