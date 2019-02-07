/* @flow */

import startCase from "lodash/startCase"

export type RawError = string
export type ErrorContext = *

export default class AppError {
  raw: RawError
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
    return this.title()
  }
}
