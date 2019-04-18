/* @flow */

import type {Descriptors, TupleSet, Tuples} from "../types"
import {concat} from "./Array"

export function accumTupleSet() {
  let descriptors: Descriptors = {}
  let tuples: {[number]: Tuples} = {}

  function clearTuples() {
    tuples = {}
  }

  function addDescriptors(newDesc: Descriptors) {
    descriptors = {...descriptors, ...newDesc}
  }

  function addTuples(newTuples: Tuples, channel: number = 0) {
    if (!tuples[channel]) tuples[channel] = []
    tuples[channel] = concat(tuples[channel], newTuples)
  }

  function getTupleSet(channel: number = 0): TupleSet {
    return {
      descriptors,
      tuples: tuples[channel] || []
    }
  }

  return {
    getTupleSet,
    addDescriptors,
    addTuples,
    clearTuples
  }
}
