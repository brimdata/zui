/* @flow */
import type {ZqdInfoMsg, ZqdIngestMsg} from "../types"

export default {
  info: (): ZqdInfoMsg => ({
    channel: "zqd:info"
  }),

  ingest(space: string, paths: string[]): ZqdIngestMsg {
    return {
      channel: "zqd:ingest",
      space,
      paths
    }
  }
}
