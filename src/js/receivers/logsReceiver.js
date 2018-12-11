/* @flow */

import * as actions from "../actions/mainSearch"
import {discoverDescriptors} from "../actions/descriptors"
import throttle from "lodash/throttle"
import type {Payload} from "./types"

const THROTTLE_DELAY = 200

export default function(dispatch: Function) {
  let buffer = []
  let done = false

  const runDispatch = throttle(() => {
    if (buffer.length !== 0) {
      dispatch(discoverDescriptors(buffer))
      dispatch(actions.mainSearchEvents(buffer))
      buffer = []
    }

    if (done) {
      dispatch(actions.completeMainSearch())
    }
  }, THROTTLE_DELAY)

  return (payload: Payload) => {
    switch (payload.type) {
      case "SearchEnd":
        done = true
        runDispatch()
        break
      case "SearchResult":
        if (payload.results.tuples.length) {
          buffer = [...buffer, ...payload.results.tuples]
          runDispatch()
        }
        break
    }
  }
}
