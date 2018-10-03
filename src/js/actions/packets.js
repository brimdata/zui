/* @flow */

import Client from "boom-js-client"
import * as spaces from "../reducers/spaces"
import downloadsFolder from "../lib/downloadsFolder"
import * as System from "../lib/System"
import {showDownloads, hideDownloads} from "./view"

export const requestPackets = (uid: string) => ({
  type: "PACKETS_REQUEST",
  uid
})

export const receivePackets = (uid: string, fileName: string) => ({
  type: "PACKETS_RECEIVE",
  uid,
  fileName
})

export const errorPackets = (uid: string, error: string) => ({
  type: "PACKETS_ERROR",
  error,
  uid
})

export const fetchPackets = (uid: string) => (
  dispatch: Function,
  getState: Function,
  api: Client
) => {
  dispatch(requestPackets(uid))
  dispatch(showDownloads())
  const state = getState()
  const space = spaces.getCurrentSpaceName(state)
  const destDir = downloadsFolder()
  return api
    .packets({uid, space, destDir})
    .then(fileName => {
      dispatch(receivePackets(uid, fileName))
      System.open(fileName.path)
      setTimeout(() => dispatch(hideDownloads()), 5000)
    })
    .catch(error => dispatch(errorPackets(uid, error)))
}
