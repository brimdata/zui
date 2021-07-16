import {app} from "electron"
import {Lake} from "ppl/lake/lake"
import {BrimMain} from "./brim"
import tron from "./tron"
import windowManager from "./tron/windowManager"

function mockLake() {
  const lake = new Lake("test")
  jest.spyOn(lake, "start").mockImplementation(() => {})
  jest.spyOn(lake, "close").mockImplementation(() => Promise.resolve())
  return lake
}

function mockSession() {
  const session = tron.session()
  jest.spyOn(session, "delete").mockImplementation(() => Promise.resolve())
  jest.spyOn(session, "save").mockImplementation(() => Promise.resolve())
  return session
}

function mockWindows() {
  const windows = windowManager()
  jest
    .spyOn(windows, "confirmQuit")
    .mockImplementation(() => Promise.resolve(true))
  jest
    .spyOn(windows, "prepareQuit")
    .mockImplementation(() => Promise.resolve([]))
  jest.spyOn(windows, "quit").mockImplementation(() => Promise.resolve())
  return windows
}

test("reset state", async () => {
  const brim = new BrimMain({
    lake: mockLake(),
    session: mockSession(),
    windows: mockWindows()
  })

  await brim.start()
  await brim.resetState()

  expect(brim.session.delete).toHaveBeenCalled()
  expect(brim.session.save).not.toHaveBeenCalled()
  expect(app.relaunch).toHaveBeenCalled()
  expect(brim.isQuitting).toBe(true)
})
