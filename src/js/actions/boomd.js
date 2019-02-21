/* @flow */

import {getCredentials} from "../reducers/boomd"
import type {Credentials} from "../lib/Credentials"
import type {Thunk} from "../reducers/types"
import {addNotification} from "./notifications"
import {LookytalkVersionError} from "../models/Errors"

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

export const connectBoomd = (): Thunk => (dispatch, getState, api) => {
  api.connect(getCredentials(getState()))
  return api.spaces()
}

export const checkLookytalkVersion = (): Thunk => (dispatch, _, api) =>
  api.serverInfo().done(({lookytalk: serverVersion}) => {
    const clientVersion = api.info().lookytalk
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
