/* @flow */

import type {Descriptors, TupleSet, Tuples} from "../types"

export function accumResults() {
  let results: TupleSet = {
    tuples: [],
    descriptors: {}
  }

  function addDescriptors(descriptors: Descriptors) {
    results.descriptors = {...results.descriptors, ...descriptors}
  }

  function addTuples(tuples: Tuples) {
    results.tuples = [...results.tuples, ...tuples]
  }

  return {
    results,
    addDescriptors,
    addTuples
  }
}
