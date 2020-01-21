/* @flow */

import type {PACKETS_ERROR, PACKETS_RECEIVE, PACKETS_REQUEST} from "./types"

export default {
  requestPackets: (uid: string): PACKETS_REQUEST => ({
    type: "PACKETS_REQUEST",
    uid
  }),

  receivePackets: (uid: string, fileName: string): PACKETS_RECEIVE => ({
    type: "PACKETS_RECEIVE",
    uid,
    fileName
  }),

  errorPackets: (uid: string, error: string): PACKETS_ERROR => ({
    type: "PACKETS_ERROR",
    error,
    uid
  })
}
