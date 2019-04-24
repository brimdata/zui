/* @flow */

import {KNOWN_ERRORS} from "./Errors"
import AppError, {type ErrorContext, type RawError} from "./AppError"

export default class ErrorFactory {
  static create(error: RawError, context?: ErrorContext): AppError {
    if (error instanceof AppError) return error

    for (let E of KNOWN_ERRORS) {
      if (E.is(error)) return new E(error, context)
    }

    return new AppError(error, context)
  }
}
