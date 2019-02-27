/* @flow */

import type {Credentials} from "../lib/Credentials"
import {LookytalkVersionError} from "../models/Errors"
import type {Thunk} from "../reducers/types"
import {addNotification} from "./notifications"

export const useBoomCache = (value: boolean) => ({
  type: "BOOMD_CACHE_USE_SET",
  value
})

export const useBoomIndex = (value: boolean) => ({
  type: "BOOMD_INDEX_USE_SET",
  value
})

export const setBoomdCredentials = (credentials: Credentials) => ({
  type: "BOOMD_CREDENTIALS_SET",
  credentials
})

export const connectBoomd = (): Thunk => (dispatch, getState, boom) => {
  return boom.spaces.list().then(() => {
    setTimeout(() => dispatch(checkLookytalkVersion()), 3000)
  })
}

export const checkLookytalkVersion = (): Thunk => (
  dispatch,
  getState,
  boom
) => {
  return boom.serverVersion().then(({lookytalk: serverVersion}) => {
    const clientVersion = boom.clientVersion().lookytalk
    if (clientVersion !== serverVersion) {
      dispatch(
        addNotification(
          new LookytalkVersionError("", {
            clientVersion,
            serverVersion
          })
        )
      )
    }
  })
}
