/* @flow */

import type {Credentials} from "../lib/Credentials"
import {LookytalkVersionError} from "../models/Errors"
import type {Thunk} from "../reducers/types"
import {addNotification} from "./notifications"
import {getBoomOptions} from "../selectors/boom"

export const inspectSearch = (
  lookytalk: string,
  overrides: Object = {}
): Thunk => (_dispatch, getState, boom) => {
  boom.setOptions(getBoomOptions(getState()))
  try {
    return boom.inspectSearch(lookytalk, overrides)
  } catch {
    return null
  }
}

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

export const connectBoomd = (): Thunk => (dispatch, getState, boom) => {
  boom.setOptions(getBoomOptions(getState()))

  if (!boom.options.host || !boom.options.port) {
    return Promise.reject("Host and port are required.")
  }

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
