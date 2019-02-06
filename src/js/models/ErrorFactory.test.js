/* @flow */

import ErrorFactory from "./ErrorFactory"
import {UnauthorizedError} from "./Errors"
import {SpaceNotFoundError} from "./Errors"
import {NetworkError} from "./Errors"
import {NoSpacesError} from "./Errors"

const context = {
  space: "fun",
  program: "neato",
  timeWindow: [new Date(), new Date()]
}

test("#create when Unathorized", () => {
  const error =
    '{"code":"UNAUTHORIZED","error":"unauthorized","HTTPStatusCode":401}'

  expect(ErrorFactory.create(error, context)).toBeInstanceOf(UnauthorizedError)
})

test("#create when Internal", () => {
  const error =
    '{"code":"INTERNAL_ERROR","error":"space not found","HTTPStatusCode":500}'

  expect(ErrorFactory.create(error, context)).toBeInstanceOf(SpaceNotFoundError)
})

test("#create when network error", () => {
  const error = "Failed to fetch"

  expect(ErrorFactory.create(error, context)).toBeInstanceOf(NetworkError)
})

test("#create when No Spaces error", () => {
  const error = "NoSpaces"

  expect(ErrorFactory.create(error, context)).toBeInstanceOf(NoSpacesError)
})
