/* @flow */

import type {Descriptors, TupleSet, Tuples} from "../types"

export function accumTupleSet() {
  let results = initTupleSet()

  function clear() {
    results = initTupleSet()
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
    addTuples,
    clear
  }
}

function initTupleSet(): TupleSet {
  return {
    tuples: [],
    descriptors: {}
  }
}
