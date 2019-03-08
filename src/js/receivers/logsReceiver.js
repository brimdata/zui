/* @flow */

import throttle from "lodash/throttle"

import type {Payload} from "./types"
import {discoverDescriptors} from "../actions/descriptors"
import {receiveLogTuples} from "../actions/logs"

const THROTTLE_DELAY = 100

export default function(dispatch: Function) {
  let buffer = []

  const dispatchNow = () => {
    if (buffer.length !== 0) {
      dispatch(discoverDescriptors(buffer))
      dispatch(receiveLogTuples(buffer))
      buffer = []
    }
  }

  const dispatchSteady = throttle(dispatchNow, THROTTLE_DELAY, {leading: false})

  return (payload: Payload) => {
    switch (payload.type) {
      case "SearchEnd":
        dispatchSteady.cancel()
        dispatchNow()
        break
      case "SearchResult":
        if (payload.results.tuples.length) {
          buffer = [...buffer, ...payload.results.tuples]
          dispatchSteady()
        }
        break
    }
  }
}
