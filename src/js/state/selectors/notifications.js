/* @flow */

import type {State} from "../state/reducers/types"

export const getNotifications = (state: State) => {
  return state.notifications
}
