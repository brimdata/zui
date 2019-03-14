/* @flow */

import throttle from "lodash/throttle"

import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import type {Payload} from "../../types"
import {clearCountByTime, receiveCountByTime} from "../../actions/countByTime"
import BaseSearch from "./BaseSearch"
import countByTimeInterval from "../../lib/countByTimeInterval"

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

  receiveData(handler: Handler, dispatch: Dispatch) {
    dispatch(clearCountByTime())
    let descriptor
    let tuples = []

    const dispatchNow = () => {
      if (tuples.length === 0) return
      dispatch(receiveCountByTime({descriptor, tuples}))
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
