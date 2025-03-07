/**
 * @jest-environment jsdom
 */

import AppError from "../../models/AppError"
import initTestStore from "src/test/unit/helpers/initTestStore"
import notice from "./"
import {Store} from "../types"
import dispatchAll from "src/test/unit/helpers/dispatchAll"

let store: Store
beforeEach(async () => {
  store = await initTestStore()
})

test("init state", () => {
  const state = store.getState()
  expect(notice.getError(state)).toEqual(null)
  expect(notice.getVisible(state)).toBe(false)
})

test("set an app error", () => {
  const e = new AppError()
  const state = dispatchAll(store, [notice.set(e)])
  const error = {
    type: "AppError",
    message: "Unknown error",
    details: [],
  }
  expect(notice.getError(state)).toEqual(error)
  expect(notice.getVisible(state)).toBe(true)
})

test("set a error", () => {
  const error = {
    type: "IngestError",
    message: "Pcap is too large to ingest",
    details: ["sort limit reached (10)"],
  }
  const state = dispatchAll(store, [notice.set(error)])
  expect(notice.getError(state)).toEqual(error)
  expect(notice.getVisible(state)).toBe(true)
})

test("clear", () => {
  const e = new AppError()
  const state = dispatchAll(store, [notice.set(e), notice.clear()])

  expect(notice.getError(state)).toEqual(null)
  expect(notice.getVisible(state)).toBe(true)
})

test("dismiss", () => {
  const e = new AppError()
  const state = dispatchAll(store, [notice.set(e), notice.dismiss()])

  const brimError = {
    type: "AppError",
    message: "Unknown error",
    details: [],
  }
  expect(notice.getError(state)).toEqual(brimError)
  expect(notice.getVisible(state)).toBe(false)
})
