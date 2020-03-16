/* @flow */

import startCase from "lodash/startCase"

import type {BrimError} from "../errors/types"

export type RawError = *
export type ErrorContext = *

export default class AppError {
  raw: *
  ts: Date

  static is(_e: RawError) {
    return false
  }

  constructor(e?: RawError, ts?: Date) {
    this.raw = e
    this.ts = ts || new Date()
  }

  title() {
    return startCase(this.constructor.name)
  }

  message(): string {
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
      if (this.raw.message) {
        return this.raw.message
      }
      return JSON.stringify(this.raw)
    }

    if (this.raw && this.raw.toString) return this.raw.toString()

    return "Unknown error"
  }

  getJSON(): Object {
    return {
      raw: this.raw,
      ts: this.ts.toJSON()
    }
  }

  details(): string[] {
    return []
  }

  toBrimError(): BrimError {
    return {
      // $FlowFixMe
      type: this.constructor.name,
      message: this.message(),
      details: this.details()
    }
  }
}
