/* @flow */

import {LookytalkVersionError} from "../../models/Errors"
import type {Thunk} from "../types"
import {addNotification, useBoomCache, useBoomIndex} from "../actions"
import {createError} from "../errors"
import {fetchLookytalkVersions, fetchSpaces} from "../../backend/fetch"
import {getBoomOptions} from "../selectors/boom"
import {updateBoomOptions} from "../../backend/options"

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

export const connectBoomd = (): Thunk => (dispatch, getState) => {
  dispatch(updateBoomOptions())

  const {host, port} = getBoomOptions(getState())

  if (!host || !port) return Promise.reject("Host and port are required.")

  return dispatch(fetchSpaces()).then(() => {
    setTimeout(() => dispatch(checkLookytalkVersion()), 3000)
  })
}

export const checkLookytalkVersion = (): Thunk => (dispatch) => {
  return dispatch(fetchLookytalkVersions()).then(({server, client}) => {
    if (client !== server) {
      let error = new LookytalkVersionError("", {
        clientVersion: client,
        serverVersion: server
      })
      dispatch(addNotification(error))
      dispatch(createError(error))
    }
  })
}
