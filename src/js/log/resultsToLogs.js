/* @flow */
import type {SearchResults} from "../state/searches/types"
import Log from "../models/Log"

export function resultsToLogs(results: SearchResults, channel: string = "0") {
  let descriptors = results.descriptors
  let tuples = results.tuples[channel] || []

  return tuples.map<Log>((t) => {
    let [td, ...tuple] = t
    let [_tdCol, ...descriptor] = descriptors[td]

    return new Log(tuple, descriptor)
  })
}
