/**
 * @jest-environment jsdom
 */

import React from "react"
import Notice from "../state/Notice"
import ErrorFactory from "../models/ErrorFactory"
import ErrorNotice from "./ErrorNotice"
import {setupBrim} from "src/test/unit/helpers/setup-brim"
import {render, screen} from "src/test/unit/helpers"
import {act} from "react-dom/test-utils"

const brim = setupBrim()

beforeEach(() => {
  render(<ErrorNotice />, {store: brim.store})
})

test("renders Error notice with no details", async () => {
  act(() => {
    brim.store.dispatch(
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
    brim.store.dispatch(
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
    brim.store.dispatch(
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
