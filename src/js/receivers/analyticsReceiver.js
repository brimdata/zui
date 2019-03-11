/* @flow */

import {setAnalysis} from "../actions/analysis"
import throttle from "lodash/throttle"
import type {Payload} from "./types"

const THROTTLE_DELAY = 200

export default (dispatch: Function, id: number) => {
  let tuples = []
  let descriptor = []

  const dispatchNow = () => {
    if (tuples.length !== 0) {
      dispatch(setAnalysis(descriptor, tuples))
      tuples = []
    }
  }

  const dispatchSteady = throttle(dispatchNow, THROTTLE_DELAY)

  return (payload: Payload) => {
    if (payload.channel_id !== id) return

    switch (payload.type) {
      case "SearchEnd":
        dispatchSteady.cancel
        dispatchNow()
        break
      case "SearchResult":
        tuples = [...tuples, ...payload.results.tuples]
        descriptor = payload.results.descriptor
        dispatchSteady()
        break
    }
  }
}
