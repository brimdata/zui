/* @flow */

import {KNOWN_ERRORS, AppError} from "./Errors"
import type {RawError} from "./Errors"

export default class ErrorFactory {
  static create(error: RawError) {
    for (let E of KNOWN_ERRORS) {
      if (E.is(error)) return new E(error)
    }

    return new AppError(error)
  }
}
