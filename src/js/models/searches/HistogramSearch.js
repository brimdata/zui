/* @flow */

import throttle from "lodash/throttle"

import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import type {Payload} from "../../types"
import {clearHistogram, receiveHistogram} from "../../actions/histogram"
import BaseSearch from "./BaseSearch"
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
    let descriptor
    let tuples = []

    const dispatchNow = () => {
      if (tuples.length === 0) return
      dispatch(receiveHistogram({descriptor, tuples}))
      tuples = []
    }

    const dispatchSteady = throttle(dispatchNow, 50, {leading: false})

    handler
      .channel(0, (payload: Payload) => {
        switch (payload.type) {
          case "SearchResult":
            descriptor = payload.results.descriptor
            tuples = [...tuples, ...payload.results.tuples]
            dispatchSteady()
            break
          case "SearchEnd":
            dispatchSteady.cancel()
            dispatchNow()
            break
        }
      })
      .abort(() => {
        dispatchSteady.cancel()
      })
  }
}
