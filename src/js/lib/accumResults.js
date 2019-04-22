/* @flow */

import type {Descriptors, TupleSet, Tuples} from "../types"
import {concat} from "./Array"

export function accumResults() {
  let descriptors: Descriptors = {}
  let tuples: {[string]: Tuples} = {}

  function clearTuples() {
    tuples = {}
  }

  function addDescriptors(newDesc: Descriptors) {
    descriptors = {...descriptors, ...newDesc}
  }

  function addTuples(newTuples: Tuples, channel: string = "0") {
    if (!tuples[channel]) tuples[channel] = []
    tuples[channel] = concat(tuples[channel], newTuples)
  }

  function getChannel(channel: string = "0"): TupleSet {
    return {
      descriptors,
      tuples: tuples[channel] || []
    }
  }

  function getResults() {
    return {
      descriptors,
      tuples
    }
  }

  function noTuples() {
    return Object.keys(tuples).length === 0
  }

  return {
    getResults,
    getChannel,
    addDescriptors,
    addTuples,
    clearTuples,
    noTuples
  }
}
