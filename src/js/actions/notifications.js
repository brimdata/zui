/* @flow */

import type {Notification} from "../types"

export const addNotification = (notification: Notification) => ({
  type: "NOTIFICATIONS_ADD",
  notification
})

export const removeNotification = (index: number) => ({
  type: "NOTIFICATIONS_REMOVE",
  index
})
