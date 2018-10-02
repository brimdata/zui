/* @flow */

import Client from "boom-js-client"
import * as spaces from "../reducers/spaces"
import downloadsFolder from "../lib/downloadsFolder"

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
  error
})

export const fetchPackets = (uid: string) => (
  dispatch: Function,
  getState: Function,
  api: Client
) => {
  dispatch(requestPackets(uid))
  const state = getState()
  const space = spaces.getCurrentSpaceName(state)
  const destDir = downloadsFolder()
  api
    .packets({uid, space, destDir})
    .then(fileName => receivePackets(uid, fileName))
    .catch(error => errorPackets(uid, error))
}
