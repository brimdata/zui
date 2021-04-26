import {Lake} from "ppl/lake/lake"
import {Brim} from "./brim"
import {installExtensions} from "./extensions"

jest.mock("./extensions", () => ({
  installExtensions: jest.fn()
}))

function mockLake() {
  const lake = new Lake("test")
  jest.spyOn(lake, "start").mockImplementation(() => {})
  return lake
}

let brim: Brim
beforeEach(() => {
  brim = new Brim({
    lake: mockLake()
  })
})

test("start is called in zed lake", async () => {
  await brim.start()
  expect(brim.lake.start).toHaveBeenCalledTimes(1)
})

test("activate when zero windows open", () => {
  expect(brim.windows.count()).toBe(0)
  brim.activate()
  expect(brim.windows.count()).toBe(1)
})

test("actiate when one or more windows open", async () => {
  brim.activate()
  expect(brim.windows.count()).toBe(1)
  brim.activate()
  expect(brim.windows.count()).toBe(1)
})

test("start opens a window", async () => {
  await brim.start()
  expect(brim.windows.count()).toBe(1)
})

test("start installs dev extensions if is dev", async () => {
  jest.spyOn(brim, "isDev").mockImplementation(() => true)
  await brim.start()
  expect(installExtensions).toHaveBeenCalled()
  // @ts-ignore
  installExtensions.mockReset()
})

test("start does not install dev extensions if not dev", async () => {
  jest.spyOn(brim, "isDev").mockImplementation(() => false)
  await brim.start()
  expect(installExtensions).not.toHaveBeenCalled()
})
