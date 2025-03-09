/**
 * @jest-environment jsdom
 */

import React from "react"
import Notice from "../state/Notice"
import ErrorFactory from "../models/ErrorFactory"
import ErrorNotice from "./ErrorNotice"
import {screen} from "src/test/unit/helpers"
import {act} from "react-dom/test-utils"
import {SystemTest} from "src/test/system"

const system = new SystemTest("error-notice.test")

beforeEach(() => {
  system.render(<ErrorNotice />)
})

test("renders Error notice with no details", async () => {
  act(() => {
    system.store.dispatch(
      Notice.set(
        ErrorFactory.create({
          type: "Bad",
          message: "Test error message",
        })
      )
    )
  })
  expect(screen.getByRole("alert")).toHaveTextContent("Test error message")
})

test("renders Error notice with detail string", async () => {
  act(() => {
    system.store.dispatch(
      Notice.set(
        ErrorFactory.create({
          type: "Bad",
          message: "Test error message",
          details: "Test detail",
        })
      )
    )
  })
  expect(screen.getByRole("alert")).toHaveTextContent("Test error message")
  expect(screen.getByRole("alert")).toHaveTextContent("Test detail")
})

test("renders Error notice with detail array", async () => {
  act(() => {
    system.store.dispatch(
      Notice.set(
        ErrorFactory.create({
          type: "Bad",
          message: "Test error message",
          details: ["Test detail 1", "Test detail 2"],
        })
      )
    )
  })
  expect(screen.getByRole("alert")).toHaveTextContent("Test error message")
  expect(screen.getByRole("alert")).toHaveTextContent("Test detail 1")
  expect(screen.getByRole("alert")).toHaveTextContent("Test detail 2")
})
