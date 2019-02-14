/* @flow */

import upperFirst from "lodash/upperFirst"
import AppError from "./AppError"
import isString from "lodash/isString"
import {type RawError} from "./AppError"

export class UnauthorizedError extends AppError {
  static is(e: RawError) {
    if (e instanceof Error) {
      if (e.message.match(/Need boom credentials/)) return true
    }

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

export class InvalidUrlError extends AppError {
  static is(e: RawError) {
    return isString(e) && e.match(/Failed to parse URL/)
  }

  message() {
    return "The host and/or port are not valid in this URL."
  }
}

export class LookytalkVersionError extends AppError {}

export const KNOWN_ERRORS = [
  InvalidUrlError,
  LookytalkVersionError,
  UnauthorizedError,
  NetworkError,
  NoSpacesError,
  SpaceNotFoundError,
  NotFoundError,
  InternalServerError
]
