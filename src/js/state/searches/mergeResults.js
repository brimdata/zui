/* @flow */
import type {SearchResults} from "./types"

export default function(a: SearchResults, b: SearchResults) {
  let descriptors = {
    ...a.descriptors,
    ...b.descriptors
  }
  let tuples = {}

  for (let channel in b.tuples) {
    let prev = a.tuples[channel] || []
    let curr = b.tuples[channel]
    tuples[channel] = [...prev, ...curr]
  }

  return {descriptors, tuples}
}
