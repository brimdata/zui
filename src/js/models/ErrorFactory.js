/* @flow */

import AppError from "./AppError"
import {KNOWN_ERRORS} from "./Errors"
import type {RawError, ErrorContext} from "./AppError"

export default class ErrorFactory {
  static create(error: RawError, context?: ErrorContext) {
    for (let E of KNOWN_ERRORS) {
      if (E.is(error)) return new E(error, context)
    }

    return new AppError(error, context)
  }
}
