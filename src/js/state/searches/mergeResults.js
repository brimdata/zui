/* @flow */
import type {SearchResults} from "./types"
import {uniq} from "../../lib/Array"

export default function(a: SearchResults, b: SearchResults) {
  let descriptors = {
    ...a.descriptors,
    ...b.descriptors
  }
  let tuples = {}

  let aChannels = Object.keys(a.tuples)
  let bChannels = Object.keys(b.tuples)
  let channels = uniq([...aChannels, ...bChannels])

  for (let channel of channels) {
    let prev = a.tuples[channel] || []
    let curr = b.tuples[channel] || []
    tuples[channel] = [...prev, ...curr]
  }

  return {descriptors, tuples}
}
