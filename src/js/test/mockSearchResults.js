/* @flow */
import type {SearchResults} from "../state/searches/types"

export function mockSearchResults(): SearchResults {
  return {
    descriptors: {"1": [{name: "_td", type: "string"}]},
    tuples: {"0": [["1"]]}
  }
}
