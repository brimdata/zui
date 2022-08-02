import "src/test/system/real-paths"
import {BrimMain} from "./brim"
import {app, ipcMain} from "electron"

function mockIpc(response) {
  jest
    .spyOn(ipcMain, "once")
    // @ts-ignore
    .mockImplementationOnce((_channel: string, listener) =>
      listener(null, response)
    )
}

let brim: BrimMain
beforeEach(async () => {
  // @ts-ignore
  app.quit.mockClear()
  brim = await BrimMain.boot()
  jest.spyOn(brim.lake, "start").mockImplementation(() => Promise.resolve(true))
  jest.spyOn(brim.lake, "stop").mockImplementation(() => Promise.resolve(true))
  jest
    .spyOn(brim.session, "load")
    // @ts-ignore
    .mockImplementation(() => Promise.resolve("fake-session-state"))
  jest.spyOn(brim.session, "save").mockImplementation(() => Promise.resolve())
  await brim.start()
})

test("quit and save", async () => {
  mockIpc(true) // the confirm ipc
  mockIpc(null) // the prepare ipc
  mockIpc({state: "test"}) // the update window state ipc

  await brim.quit()

  expect(brim.isQuitting).toBe(true)
  expect(brim.session.save).toHaveBeenCalledTimes(1)
  expect(brim.lake.stop).toHaveBeenCalledTimes(1)
  expect(app.quit).toHaveBeenCalledTimes(1)
})

test("quit without saving", async () => {
  mockIpc(true) // confirm
  mockIpc(null) // prepare

  await brim.quit({saveSession: false})

  expect(brim.isQuitting).toBe(true)
  expect(brim.session.save).not.toHaveBeenCalled()
  expect(brim.lake.stop).toHaveBeenCalledTimes(1)
  expect(app.quit).toHaveBeenCalledTimes(1)
})
