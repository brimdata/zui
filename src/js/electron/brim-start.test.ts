import "src/test/system/real-paths"
import {app} from "electron"
import {BrimMain} from "./brim"
import {installExtensions} from "./extensions"
import {main} from "./run-main/run-main"
import env from "src/app/core/env"

jest.mock("./extensions", () => ({
  installExtensions: jest.fn(),
}))

jest.mock("@brimdata/zealot")

test("start is called in zed lake", async () => {
  const brim = (await main({devtools: false, autoUpdater: false})) as BrimMain
  expect(brim.lake.start).toHaveBeenCalledTimes(1)
})

test("app opens a window on startup", async () => {
  const brim = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as BrimMain
  expect(brim.windows.visible).toHaveLength(1)
})
test("activate creates window if there are none", async () => {
  const brim = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as BrimMain
  // @ts-ignore clear the windows for the test
  brim.windows.windows = {}
  app.emit("activate")
  expect(brim.windows.visible).toHaveLength(1)
})

test("activates shows the window", async () => {
  const brim = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as BrimMain
  app.emit("activate")
  expect(brim.windows.visible).toHaveLength(1)
  brim.windows.visible.forEach((win) => {
    expect(win.ref.show).toHaveBeenCalled()
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

  const brim = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as BrimMain
  const preventDefault = jest.fn()
  brim.windows.emit("window-will-close", {preventDefault})

  expect(preventDefault).toHaveBeenCalled()
  expect(brim.windows.visible[0].ref.hide).toHaveBeenCalled()
  expect(app.quit).not.toHaveBeenCalled()
})

test("last window quits on not mac", async () => {
  jest.spyOn(env, "isMac", "get").mockReturnValue(false)

  const brim = (await main({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })) as BrimMain
  const preventDefault = jest.fn()
  brim.windows.emit("window-will-close", {preventDefault})

  expect(preventDefault).toHaveBeenCalled()
  expect(brim.windows.visible[0].ref.hide).not.toHaveBeenCalled()
  expect(app.quit).toHaveBeenCalled()
})
