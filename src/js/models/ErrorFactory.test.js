/* @flow */

import ErrorFactory from "./ErrorFactory"
import {UnauthorizedError} from "./Errors"
import {InternalServerError} from "./Errors"
import {NetworkError} from "./Errors"
import {NoSpacesError} from "./Errors"

test("#create when Unathorized", () => {
  const error =
    '{"code":"UNAUTHORIZED","error":"unauthorized","HTTPStatusCode":401}'

  expect(ErrorFactory.create(error)).toBeInstanceOf(UnauthorizedError)
})

test("#create when Internal", () => {
  const error =
    '{"code":"INTERNAL_ERROR","error":"space not found","HTTPStatusCode":500}'

  expect(ErrorFactory.create(error)).toBeInstanceOf(InternalServerError)
})

test("#create when network error", () => {
  const error = "Failed to fetch"

  expect(ErrorFactory.create(error)).toBeInstanceOf(NetworkError)
})

test("#create when No Spaces error", () => {
  const error = "NoSpaces"

  expect(ErrorFactory.create(error)).toBeInstanceOf(NoSpacesError)
})
