/* @flow */

import type {State} from "../types"

export const getNotifications = (state: State) => {
  return state.notifications
}
