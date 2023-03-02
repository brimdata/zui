import "src/test/system/real-paths"
import {app} from "electron"
import {ZuiMain} from "./zui-main"

jest.mock("./session", () => {
  return () => ({
    load: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    save: jest.fn(() => Promise.resolve()),
  })
})

test("reset state", async () => {
  const main = await ZuiMain.boot({
    lake: false,
  })

  await main.start()
  await main.resetState()

  expect(main.session.delete).toHaveBeenCalled()
  expect(main.session.save).not.toHaveBeenCalled()
  expect(app.relaunch).toHaveBeenCalled()
})
