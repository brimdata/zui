/* @flow */

import type {Credentials} from "../lib/Credentials"
import {LookytalkVersionError} from "../models/Errors"
import type {Thunk} from "../reducers/types"
import {addNotification} from "./notifications"
import {getBoomClient} from "../selectors/boom"
import {getCredentials} from "../reducers/boomd"

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

export const connectBoomd = (): Thunk => (dispatch, getState) => {
  const boom = getBoomClient(getState())
  return boom.spaces.list()
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
