/* @flow */

import {AppError} from "../models/Errors"

export type Notification =
  | AppError
  | {
      type: string,
      data: Object,
      key: string
    }
