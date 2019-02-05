/* @flow */

import startCase from "lodash/startCase"
import upperFirst from "lodash/upperFirst"

export type RawError = string

export class AppError {
  raw: RawError

  static is(_e: RawError) {
    return false
  }

  constructor(e: RawError) {
    this.raw = e
  }

  title() {
    return startCase(this.constructor.name)
  }

  message() {
    return "An error occurred."
  }
}

export class UnauthorizedError extends AppError {
  static is(e: RawError) {
    try {
      return JSON.parse(e).code === "UNAUTHORIZED"
    } catch (e) {
      return false
    }
  }
}

export class InternalServerError extends AppError {
  static is(e: RawError) {
    try {
      return JSON.parse(e).code === "INTERNAL_ERROR"
    } catch (e) {
      return false
    }
  }
}

export class NetworkError extends AppError {
  static is(e: RawError) {
    return e === "Failed to fetch"
  }
}

export class NoSpacesError extends AppError {
  static is(e: RawError) {
    return e === "NoSpaces"
  }
}

export class NotFoundError extends AppError {
  static is(e: RawError) {
    try {
      return JSON.parse(e).code === "NOT_FOUND"
    } catch (e) {
      return false
    }
  }

  message() {
    return upperFirst(JSON.parse(this.raw).error)
  }
}

export const KNOWN_ERRORS = [
  UnauthorizedError,
  InternalServerError,
  NetworkError,
  NoSpacesError,
  NotFoundError
]
