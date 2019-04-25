/* @flow */

import AppError from "../../models/AppError"
import createReducer from "./createReducer"

const initialState = []
export type Notifications = AppError[]

export default createReducer(initialState, {
  NOTIFICATIONS_CLEAR: () => [],
  NOTIFICATIONS_ADD: (state, {notification}) => [...state, notification],
  NOTIFICATIONS_REMOVE: (state, {index}) => {
    const arr = [...state]
    arr.splice(index, 1)
    return arr
  }
})
