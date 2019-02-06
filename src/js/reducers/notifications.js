/* @flow */

import createReducer from "./createReducer"
import {AppError} from "../models/Errors"

const initialState = []
export type Notifications = AppError[]

export default createReducer(initialState, {
  NOTIFICATIONS_ADD: (state, {notification}) => [...state, notification],
  NOTIFICATIONS_REMOVE: (state, {index}) => {
    const arr = [...state]
    arr.splice(index, 1)
    return arr
  }
})
