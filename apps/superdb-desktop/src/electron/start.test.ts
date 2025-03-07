import "src/test/system/real-paths"
import {app} from "electron"
import {MainObject} from "../core/main/main-object"
import {main} from "./run-main/run-main"
import env from "src/core/env"
import {teardown} from "src/test/system/teardown"

jest.mock("superdb-node-client")

afterEach(teardown)

test("app opens a window on startup", async () => {
  const appMain = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as MainObject
  expect(appMain.windows.visible).toHaveLength(1)
})
test("activate creates window if there are none", async () => {
  const appMain = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as MainObject
  // @ts-ignore clear the windows for the test
  appMain.windows.windows = {}
  app.emit("activate")
  expect(appMain.windows.visible).toHaveLength(1)
})

test("activates shows the window", async () => {
  const appMain = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as MainObject
  app.emit("activate")
  expect(appMain.windows.visible).toHaveLength(1)
  appMain.windows.visible.forEach((win) => {
    expect(win.ref.isVisible()).toBe(true)
  })
})

test("last window closed hides on mac", async () => {
  jest.spyOn(env, "isMac", "get").mockReturnValue(true)

  const appMain = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as MainObject
  const preventDefault = jest.fn()
  appMain.windows.emit("window-will-close", {preventDefault})

  expect(preventDefault).toHaveBeenCalled()
  expect(appMain.windows.visible[0].ref.isVisible()).toBe(false)
  expect(app.quit).not.toHaveBeenCalled()
})

test("last window quits on not mac", async () => {
  jest.spyOn(env, "isMac", "get").mockReturnValue(false)

  const appMain = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as MainObject
  const preventDefault = jest.fn()
  appMain.windows.emit("window-will-close", {preventDefault})

  expect(preventDefault).toHaveBeenCalled()
  expect(appMain.windows.visible[0].ref.isVisible()).toBe(true)
  expect(app.quit).toHaveBeenCalled()
})
