

import { PACKETS_ERROR, PACKETS_RECEIVE, PACKETS_REQUEST } from "./types";

export default {
  request: (uid: string): PACKETS_REQUEST => ({
    type: "PACKETS_REQUEST",
    uid
  }),

  receive: (uid: string, fileName: string): PACKETS_RECEIVE => ({
    type: "PACKETS_RECEIVE",
    uid,
    fileName
  }),

  error: (uid: string, error: string): PACKETS_ERROR => ({
    type: "PACKETS_ERROR",
    error,
    uid
  })
};