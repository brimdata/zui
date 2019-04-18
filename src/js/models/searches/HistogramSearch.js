/* @flow */

import throttle from "lodash/throttle"

import type {BoomPayload} from "../../BoomClient/types"
import type {Dispatch} from "../../state/reducers/types"
import {accumTupleSet} from "../../lib/accumResults"
import {clearHistogram, histogramSearchResult} from "../../state/actions"
import BaseSearch from "./BaseSearch"
import Handler from "../../BoomClient/lib/Handler"
import Log from "../Log"
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
    let accum = accumTupleSet()

    const dispatchNow = () => {
      dispatch(histogramSearchResult(Log.fromTupleSet(accum.getTupleSet())))
    }

    const dispatchSteady = throttle(dispatchNow, 50, {leading: false})

    handler
      .each((payload: BoomPayload) => {
        switch (payload.type) {
          case "SearchDescriptors":
            accum.addDescriptors(payload.descriptors)
            break
          case "SearchTuples":
            accum.addTuples(payload.tuples)
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
