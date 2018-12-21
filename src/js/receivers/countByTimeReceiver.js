/* @flow */

import {receiveCountByTime, reset} from "../actions/countByTime"
import throttle from "lodash/throttle"
import type {Payload} from "./types"

export default (dispatch: Function) => {
  dispatch(reset())
  let descriptor
  let tuples = []

  const dispatchNow = () => {
    if (tuples.length === 0) return
    dispatch(receiveCountByTime({descriptor, tuples}))
    tuples = []
  }

  const dispatchSteady = throttle(dispatchNow, 50, {leading: false})

  return (payload: Payload) => {
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
  }
}
