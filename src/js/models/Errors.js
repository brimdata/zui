/* @flow */

import upperFirst from "lodash/upperFirst"
import AppError from "./AppError"
import isString from "lodash/isString"
import {type RawError} from "./AppError"

export class UnauthorizedError extends AppError {
  static is(e: RawError) {
    if (e instanceof Error && e.message.match(/Need boom credentials/))
      return true
    if (e.type === "UNAUTHORIZED") return true
    if (typeof e === "string" && /unauthorized/i.test(e)) return true
    return false
  }

  message() {
    return "Your credentials are not authorized to connect to this server."
  }
}

export class InternalServerError extends AppError {
  static is(e: RawError) {
    return e.type === "INTERNAL_ERROR"
  }

  message() {
    return upperFirst(this.raw.error) + "."
  }
}

export class NetworkError extends AppError {
  static is(e: RawError) {
    return /(Failed to fetch|ECONNREFUSED)/.test(e.toString())
  }

  message() {
    return "The server could not be reached."
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
    return e.type === "NOT_FOUND"
  }

  message() {
    return upperFirst(this.raw.error) + "."
  }
}

export class SpaceNotFoundError extends AppError {
  static is(e: RawError) {
    return e.type === "SPACE_NOT_FOUND"
  }

  message() {
    return upperFirst(this.raw.error) + "."
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

export class LookytalkVersionError extends AppError {
  message() {
    return "The server and client lookytalk versions do not match."
  }
}

export class SearchError extends AppError {
  static is(e: RawError) {
    return e.type === "SEARCH_ERROR"
  }

  message() {
    return this.raw.error
  }
}

export const KNOWN_ERRORS = [
  SearchError,
  InvalidUrlError,
  LookytalkVersionError,
  UnauthorizedError,
  NetworkError,
  NoSpacesError,
  SpaceNotFoundError,
  NotFoundError,
  InternalServerError
]
