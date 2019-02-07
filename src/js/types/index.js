/* @flow */

import AppError from "../models/AppError"

export type Notification =
  | AppError
  | {
      type: string,
      data: Object,
      key: string
    }
