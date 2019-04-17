/* @flow */

import type {State} from "../reducers/types"

export const getNotifications = (state: State) => {
  return state.notifications
}
