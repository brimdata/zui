import "src/test/system/real-paths"
import {BrimMain} from "./brim"
import {installExtensions} from "./extensions"

jest.mock("./extensions", () => ({
  installExtensions: jest.fn(),
}))

jest.mock("@brimdata/zealot")

test("start is called in zed lake", async () => {
  const brim = await BrimMain.boot({devtools: false, autoUpdater: false})
  await brim.start()
  expect(brim.lake.start).toHaveBeenCalledTimes(1)
})

test("activate when zero windows open", async () => {
  const brim = await BrimMain.boot({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })
  expect(brim.windows.count).toBe(0)
  await brim.activate()
  // default "search" window + "hidden" window (background renderer) === 2
  expect(brim.windows.count).toBe(2)
})

test("activate when one or more windows open", async () => {
  const brim = await BrimMain.boot({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })
  await brim.activate()
  expect(brim.windows.count).toBe(2)
  await brim.activate()
  expect(brim.windows.count).toBe(2)
})

test("start opens default windows and in correct focus order", async () => {
  const brim = await BrimMain.boot({
    devtools: false,
    autoUpdater: false,
    lake: false,
  })
  await brim.start()
  expect(brim.windows.count).toBe(2)
  const windows = brim.windows.all
  try {
    expect(windows[0].name).toBe("search")
    expect(windows[1].name).toBe("hidden")
  } catch (e) {
    // this try block has been proven to be indeterminate, log windows too if it fails so we can see why
    console.error("windows are: ", windows)
    throw e
  }
})

test("start installs dev extensions if is dev", async () => {
  const brim = await BrimMain.boot({
    lake: false,
    devtools: true,
    autoUpdater: false,
  })
  await brim.start()
  expect(installExtensions).toHaveBeenCalled()
  // @ts-ignore
  installExtensions.mockReset()
})

test("start does not install dev extensions if not dev", async () => {
  const brim = await BrimMain.boot({
    lake: false,
    devtools: false,
    autoUpdater: false,
  })
  await brim.start()
  expect(installExtensions).not.toHaveBeenCalled()
})
