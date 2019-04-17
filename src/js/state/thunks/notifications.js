/* @flow */

import type {Thunk} from "../reducers/types"
import {addNotification} from "../actions"

export const notifyLookytalkVersionError = (
  clientVersion: string,
  serverVersion: string
): Thunk => (dispatch) => {
  dispatch(
    addNotification({
      type: "LookytalkVersionError",
      data: {client: clientVersion, server: serverVersion},
      key: new Date().getTime().toString()
    })
  )
}
