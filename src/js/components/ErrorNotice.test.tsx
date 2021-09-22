import React from "react"

import logInto from "../../../test/unit/helpers/loginTo"
import provide from "../../../test/unit/helpers/provide"
import Notice from "../state/Notice"
import ErrorFactory from "../models/ErrorFactory"
import ErrorNotice from "./ErrorNotice"
import {screen} from "@testing-library/react"

test("renders Error notice with no details", async () => {
  const {store} = await logInto("workspace1", "pool1")
  store.dispatch(
    Notice.set(
      ErrorFactory.create({
        type: "Bad",
        message: "Test error message"
      })
    )
  )
  provide(store, <ErrorNotice />)
  expect(screen.getByRole("alert")).toHaveTextContent("Test error message")
})

test("renders Error notice with detail string", async () => {
  const {store} = await logInto("workspace1", "pool1")
  store.dispatch(
    Notice.set(
      ErrorFactory.create({
        type: "Bad",
        message: "Test error message",
        details: "Test detail"
      })
    )
  )
  provide(store, <ErrorNotice />)
  expect(screen.getByRole("alert")).toHaveTextContent("Test error message")
  expect(screen.getByRole("alert")).toHaveTextContent("Test detail")
})

test("renders Error notice with detail array", async () => {
  const {store} = await logInto("workspace1", "pool1")
  store.dispatch(
    Notice.set(
      ErrorFactory.create({
        type: "Bad",
        message: "Test error message",
        details: ["Test detail 1", "Test detail 2"]
      })
    )
  )
  provide(store, <ErrorNotice />)
  expect(screen.getByRole("alert")).toHaveTextContent("Test error message")
  expect(screen.getByRole("alert")).toHaveTextContent("Test detail 1")
  expect(screen.getByRole("alert")).toHaveTextContent("Test detail 2")
})
