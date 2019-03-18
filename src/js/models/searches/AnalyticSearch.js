/* @flow */

import throttle from "lodash/throttle"

import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import type {Payload} from "../../types"
import {addHeadProc} from "../../lib/Program"
import {setAnalysis} from "../../actions/analysis"
import BaseSearch from "./BaseSearch"

export const ANALYTIC_MAX_RESULTS = 10000

export default class AnalyticSearch extends BaseSearch {
  getProgram() {
    return addHeadProc(this.program, ANALYTIC_MAX_RESULTS)
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    const THROTTLE_DELAY = 200
    let tuples = []
    let descriptor = []

    const dispatchNow = () => {
      if (tuples.length !== 0) {
        dispatch(setAnalysis(descriptor, tuples))
        tuples = []
      }
    }

    const dispatchSteady = throttle(dispatchNow, THROTTLE_DELAY)

    handler
      .channel(0, (payload: Payload) => {
        switch (payload.type) {
          case "SearchEnd":
            dispatchSteady.cancel()
            dispatchNow()
            break
          case "SearchResult":
            tuples = [...tuples, ...payload.results.tuples]
            descriptor = payload.results.descriptor
            dispatchSteady()
            break
        }
      })
      .abort(() => {
        dispatchSteady.cancel()
      })
  }
}
