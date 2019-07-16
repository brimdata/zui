/* @flow */

import startCase from "lodash/startCase"

export type RawError = *
export type ErrorContext = *

export default class AppError {
  raw: *
  ts: Date
  context: ErrorContext

  static is(_e: RawError) {
    return false
  }

  constructor(e: RawError, context: ErrorContext = {}) {
    this.raw = e
    this.context = context
    this.ts = new Date()
  }

  title() {
    return startCase(this.constructor.name)
  }

  message() {
    if (this.raw instanceof Error) {
      return this.raw.message
    }

    if (typeof this.raw === "string") {
      return this.raw
    }

    if (typeof this.raw === "object") {
      if (this.raw.error) {
        return this.raw.error
      }
      return JSON.stringify(this.raw)
    }

    return this.raw.toString()
  }
}
