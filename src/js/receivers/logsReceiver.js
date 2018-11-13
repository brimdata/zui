/* @flow */

import * as actions from "../actions/mainSearch"
import * as logViewer from "../actions/logViewer"
import {discoverDescriptors} from "../actions/descriptors"
import throttle from "lodash/throttle"
import type {Tuple, Descriptor} from "../models/Log"

type SearchResult = {
  type: "SearchResult",
  results: {
    tuples: Tuple[],
    descriptor: Descriptor
  }
}

type SearchEnd = {
  type: "SearchEnd"
}

type Payload = SearchResult | SearchEnd

export default function(dispatch: Function, expectedCount: number) {
  let buffer = []
  let count = 0

  const dispatchEvents = throttle(() => {
    if (buffer.length === 0) return
    dispatch(actions.mainSearchEvents(buffer))
    dispatch(discoverDescriptors(buffer))
    buffer = []
  }, 200)

  return (payload: Payload) => {
    if (payload.type === "SearchResult") {
      const tuples = payload.results.tuples
      if (tuples.length) {
        count += tuples.length
        buffer = [...buffer, ...tuples]
        dispatchEvents()
      }
    }

    if (payload.type === "SearchEnd") {
      dispatch(logViewer.setMoreAhead(count >= expectedCount))
    }
  }
}
