jest.mock("./extensions", () => ({
  installExtensions: jest.fn()
}))
import {installExtensions} from "./extensions"
import {Brim} from "./brim"

test("activate when zero windows open", () => {
  const brim = new Brim()
  expect(brim.windows.count()).toBe(0)
  brim.activate()
  expect(brim.windows.count()).toBe(1)
})

test("actiate when one or more windows open", () => {
  const brim = new Brim()
  brim.activate()
  expect(brim.windows.count()).toBe(1)
  brim.activate()
  expect(brim.windows.count()).toBe(1)
})

test("start opens a window", () => {
  const brim = new Brim()
  brim.start()
  expect(brim.windows.count()).toBe(1)
})

test("start installs dev extensions if is dev", () => {
  const brim = new Brim()
  jest.spyOn(brim, "isDev").mockImplementation(() => true)
  brim.start()
  expect(installExtensions).toHaveBeenCalled()
  // @ts-ignore
  installExtensions.mockReset()
})

test("start does not install dev extensions if not dev", () => {
  const brim = new Brim()
  jest.spyOn(brim, "isDev").mockImplementation(() => false)
  brim.start()
  expect(installExtensions).not.toHaveBeenCalled()
})
