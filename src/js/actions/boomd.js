/* @flow */

import type {Credentials} from "../lib/Credentials"
import {LookytalkVersionError} from "../models/Errors"
import type {Thunk} from "../reducers/types"
import {addNotification} from "./notifications"
import {fetchLookytalkVersions, fetchSpaces} from "../backend/fetch"
import {getBoomOptions} from "../selectors/boom"
import {updateBoomOptions} from "../backend/options"

export const useBoomCache = (value: boolean) => ({
  type: "BOOMD_CACHE_USE_SET",
  value
})

export const useBoomIndex = (value: boolean) => ({
  type: "BOOMD_INDEX_USE_SET",
  value
})

export const enableCache = (value: boolean): Thunk => (
  dispatch,
  getState,
  boom
) => {
  dispatch(useBoomCache(value))
  boom.setOptions({enableCache: value})
}

export const enableIndex = (value: boolean): Thunk => (
  dispatch,
  getState,
  boom
) => {
  dispatch(useBoomIndex(value))
  boom.setOptions({enableCache: value})
}

export const setBoomdCredentials = (credentials: Credentials) => ({
  type: "BOOMD_CREDENTIALS_SET",
  credentials
})

export const connectBoomd = (): Thunk => (dispatch, getState) => {
  dispatch(updateBoomOptions())

  const {host, port} = getBoomOptions(getState())

  if (!host || !port) return Promise.reject("Host and port are required.")

  return dispatch(fetchSpaces()).then(() => {
    setTimeout(() => dispatch(checkLookytalkVersion()), 3000)
  })
}

export const checkLookytalkVersion = (): Thunk => dispatch => {
  return dispatch(fetchLookytalkVersions()).then(({server, client}) => {
    if (client !== server) {
      let error = new LookytalkVersionError("", {
        clientVersion: client,
        serverVersion: server
      })
      dispatch(addNotification(error))
    }
  })
}
