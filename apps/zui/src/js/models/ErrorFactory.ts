import {ErrorData} from "../errors/types"
import {KNOWN_ERRORS} from "./Errors"
import AppError, {RawError} from "./AppError"

function compareKeys(a, b) {
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  return JSON.stringify(aKeys) === JSON.stringify(bKeys)
}

export default class ErrorFactory {
  static create(error: RawError): ErrorData {
    if (error.type && error.message) return error

    if (error instanceof AppError) return error.toError()

    for (const E of KNOWN_ERRORS) {
      if (E.is(error)) return new E(error).toError()
    }

    // if raw error has same keys as AppError, then rebuild
    if (compareKeys(error, new AppError())) {
      return new AppError(error.raw, new Date(error.ts)).toError()
    }

    return new AppError(error).toError()
  }
}
