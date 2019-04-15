/* @flow */

import type {Results} from "../types"

export function accumResults() {
  let data = {
    tuples: [],
    descriptor: []
  }

  function handle(results: Results) {
    data.descriptor = results.descriptor
    data.tuples = [...data.tuples, ...results.tuples]
  }

  return {
    data,
    handle
  }
}
