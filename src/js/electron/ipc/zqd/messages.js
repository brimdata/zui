/* @flow */
import type {ZqdInfoMsg, ZqdIngestMsg, ZqdSubscribeMsg} from "../types"

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
  },

  subscribe(): ZqdSubscribeMsg {
    return {
      channel: "zqd:subscribe"
    }
  }
}
