/* @flow */

import type {Descriptor, Tuple} from "../types"

export function setAnalysis(descriptor: Descriptor, tuples: Tuple[]) {
  return {
    type: "ANALYSIS_SET",
    descriptor,
    tuples
  }
}

export const clearAnalysis = () => ({
  type: "ANALYSIS_CLEAR"
})
