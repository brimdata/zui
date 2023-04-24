import "src/test/system/real-paths"
import {app} from "electron"
import {ZuiMain} from "./zui-main"
import {installExtensions} from "./extensions"
import {main} from "./run-main/run-main"
import env from "src/app/core/env"

jest.mock("./extensions", () => ({
  installExtensions: jest.fn(),
}))

jest.mock("@brimdata/zed-node")

test("start is called in zed lake", async () => {
  const appMain = (await main({devtools: false, autoUpdater: false})) as ZuiMain
  expect(appMain.lake.start).toHaveBeenCalledTimes(1)
})

test("app opens a window on startup", async () => {
  const appMain = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as ZuiMain
  expect(appMain.windows.visible).toHaveLength(1)
})
test("activate creates window if there are none", async () => {
  const appMain = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as ZuiMain
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
  })) as ZuiMain
  app.emit("activate")
  expect(appMain.windows.visible).toHaveLength(1)
  appMain.windows.visible.forEach((win) => {
    expect(win.ref.isVisible()).toBe(true)
  })
})

test("start installs dev extensions if is dev", async () => {
  await main({
    devtools: true,
    autoUpdater: false,
    lake: false,
  })
  expect(installExtensions).toHaveBeenCalled()
  // @ts-ignore
  installExtensions.mockReset()
})

test("start does not install dev extensions if not dev", async () => {
  await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })
  expect(installExtensions).not.toHaveBeenCalled()
})

test("last window closed hides on mac", async () => {
  jest.spyOn(env, "isMac", "get").mockReturnValue(true)

  const appMain = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as ZuiMain
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
  })) as ZuiMain
  const preventDefault = jest.fn()
  appMain.windows.emit("window-will-close", {preventDefault})

  expect(preventDefault).toHaveBeenCalled()
  expect(appMain.windows.visible[0].ref.isVisible()).toBe(true)
  expect(app.quit).toHaveBeenCalled()
})
