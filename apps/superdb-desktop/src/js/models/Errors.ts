import isString from "lodash/isString"
import upperFirst from "lodash/upperFirst"

import AppError, {RawError} from "./AppError"

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
    return "The service could not be reached."
  }
}

export class NoPoolsError extends AppError {
  static is(e: RawError) {
    return e === "NoPools"
  }

  message() {
    return "No pools in this lake."
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

export class PoolNotFoundError extends AppError {
  static is(e: RawError) {
    return e.type === "SPACE_NOT_FOUND"
  }

  message() {
    return upperFirst(this.raw.error) + "."
  }
}

export class InvalidUrlError extends AppError {
  static is(e: RawError) {
    return !!(isString(e) && e.match(/Failed to parse URL/))
  }

  message() {
    return "The host and/or port are not valid in this URL."
  }
}

export class ZqVersionError extends AppError {
  client: string
  server: string
  constructor({client, server}: {client: string; server: string}) {
    super()
    this.client = client
    this.server = server
  }

  message() {
    return "Server and client zq versions do not match."
  }

  details() {
    return [`Client: ${this.client}`, `Server: ${this.server}`]
  }
}

export class SearchError extends AppError {
  static is(e: RawError) {
    return e && e.type === "SEARCH_ERROR"
  }

  message() {
    return this.raw.error
  }
}

export const KNOWN_ERRORS = [
  SearchError,
  InvalidUrlError,
  ZqVersionError,
  UnauthorizedError,
  NetworkError,
  NoPoolsError,
  PoolNotFoundError,
  NotFoundError,
  InternalServerError,
]
