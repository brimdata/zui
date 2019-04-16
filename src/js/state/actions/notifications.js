/* @flow */

import type {Notification} from "../types"
import type {Thunk} from "../reducers/types"

export const addNotification = (notification: Notification) => ({
  type: "NOTIFICATIONS_ADD",
  notification
})

export const removeNotification = (index: number) => ({
  type: "NOTIFICATIONS_REMOVE",
  index
})

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
