/* @flow */

import createReducer from "./createReducer"
import {type Notification} from "../types"

const initialState = []
export type Notifications = Notification[]

export default createReducer(initialState, {
  NOTIFICATIONS_ADD: (state, {notification}) => [...state, notification],
  NOTIFICATIONS_REMOVE: (state, {index}) => {
    const arr = [...state]
    arr.splice(index, 1)
    return arr
  }
})
