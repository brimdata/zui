/* @flow */

import {completeMainSearch} from "../actions/mainSearch"
import {setAnalysis} from "../actions/analysis"
import throttle from "lodash/throttle"

import type {Payload} from "./types"

const THROTTLE_DELAY = 200

export default (dispatch: Function, id: number) => {
  let tuples = []
  let descriptor = []
  let done = false

  const dispatchResults = throttle(() => {
    if (tuples.length !== 0) {
      dispatch(setAnalysis({id, tuples, descriptor}))
      tuples = []
    }
    if (done) {
      dispatch(completeMainSearch())
    }
  }, THROTTLE_DELAY)

  return (payload: Payload) => {
    if (payload.channel_id !== id) return

    switch (payload.type) {
      case "SearchEnd":
        done = true
        dispatchResults()
        break
      case "SearchResult":
        tuples = [...tuples, ...payload.results.tuples]
        descriptor = payload.results.descriptor
        dispatchResults()
        break
    }
  }
}
