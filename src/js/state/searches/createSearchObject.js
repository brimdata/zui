/* @flow */
import type {Search} from "./types"
import Handler from "../../BoomClient/lib/Handler"

export default function(name: string, tag: string, handler: Handler): Search {
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
