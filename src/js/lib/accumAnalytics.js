/* @flow */

import type {Descriptor, Payload, Tuple} from "../types"

type Analytic = {
  descriptor: Descriptor,
  tuples: Tuple[]
}

export default (callback: (Analytic) => *) => {
  let accum = {descriptor: [], tuples: []}

  return (payload: Payload) => {
    switch (payload.type) {
      case "SearchResult":
        accum.descriptor = payload.results.descriptor
        accum.tuples = [...accum.tuples, ...payload.results.tuples]
        break
      case "SearchEnd":
        callback(accum)
        break
    }
  }
}
