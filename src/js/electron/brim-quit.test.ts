import {Brim} from "./brim"
import {app, ipcMain} from "electron"

function mockIpc(response) {
  jest
    .spyOn(ipcMain, "once")
    // @ts-ignore
    .mockImplementationOnce((_channel: string, listener) =>
      listener(null, response)
    )
}

let brim: Brim
beforeEach(async () => {
  // @ts-ignore
  app.quit.mockClear()
  brim = new Brim()
  jest.spyOn(brim.lake, "start").mockImplementation(() => {})
  jest.spyOn(brim.lake, "close").mockImplementation(() => Promise.resolve())
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
  expect(brim.lake.close).toHaveBeenCalledTimes(1)
  expect(app.quit).toHaveBeenCalledTimes(1)
})

test("quit without saving", async () => {
  mockIpc(true) // confirm
  mockIpc(null) // prepare

  await brim.quit({saveSession: false})

  expect(brim.isQuitting).toBe(true)
  expect(brim.session.save).not.toHaveBeenCalled()
  expect(brim.lake.close).toHaveBeenCalledTimes(1)
  expect(app.quit).toHaveBeenCalledTimes(1)
})
