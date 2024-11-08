import "src/test/system/real-paths"
import {app} from "electron"
import {MainObject} from "../core/main/main-object"

jest.mock("./session", () => {
  return () => ({
    load: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    save: jest.fn(() => Promise.resolve()),
  })
})

test("reset state", async () => {
  const main = await MainObject.boot({
    lake: false,
  })

  const reset = jest.spyOn(main.appState, "reset")
  const save = jest.spyOn(main.appState, "save")
  await main.start()
  await main.resetState()

  expect(reset).toHaveBeenCalled()
  expect(save).not.toHaveBeenCalled()
  expect(app.relaunch).toHaveBeenCalled()
})
