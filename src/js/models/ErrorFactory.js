/* @flow */

import {KNOWN_ERRORS, AppError} from "./Errors"
import type {RawError, ErrorContext} from "./Errors"

export default class ErrorFactory {
  static create(error: RawError, context?: ErrorContext) {
    for (let E of KNOWN_ERRORS) {
      if (E.is(error)) return new E(error, context)
    }

    return new AppError(error, context)
  }
}
