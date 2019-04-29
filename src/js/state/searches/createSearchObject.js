/* @flow */
import type {Search} from "./types"
import BoomRequest from "../../BoomClient/lib/BoomRequest"

export default function(
  name: string,
  tag: string,
  handler: BoomRequest
): Search {
  return {
    name,
    tag,
    handler,
    status: "FETCHING",
    stats: {
      updateTime: 0,
      startTime: 0,
      bytesMatched: 0,
      bytesRead: 0,
      tuplesMatched: 0,
      tuplesRead: 0
    },
    results: {
      tuples: {},
      descriptors: {}
    }
  }
}
