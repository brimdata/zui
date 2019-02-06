/* @flow */

import startCase from "lodash/startCase"
import upperFirst from "lodash/upperFirst"

export type RawError = string

export type ErrorContext = *

export class AppError {
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

  message() {
    return "Your credentials are not authorized to connect to this server."
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

  message() {
    return upperFirst(JSON.parse(this.raw).error) + "."
  }
}

export class NetworkError extends AppError {
  static is(e: RawError) {
    return e === "Failed to fetch"
  }

  message() {
    return "Either the server is not running or you do not have internet access."
  }
}

export class NoSpacesError extends AppError {
  static is(e: RawError) {
    return e === "NoSpaces"
  }

  message() {
    return "This host has no spaces to search. Use the command line to create a space, then reload this page."
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
    return upperFirst(JSON.parse(this.raw).error) + "."
  }
}

export class SpaceNotFoundError extends AppError {
  static is(e: RawError) {
    try {
      const {code, error} = JSON.parse(e)
      return code === "INTERNAL_ERROR" && error === "space not found"
    } catch (e) {
      return false
    }
  }

  message() {
    if (this.context.space)
      return `Could not find space "${this.context.space}".`
    else {
      return "Could not find space."
    }
  }
}

export class LookytalkVersionError extends AppError {}

export const KNOWN_ERRORS = [
  LookytalkVersionError,
  UnauthorizedError,
  NetworkError,
  NoSpacesError,
  SpaceNotFoundError,
  NotFoundError,
  InternalServerError
]
