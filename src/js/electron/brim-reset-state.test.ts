import "src/test/system/real-paths"
import {app} from "electron"
import {BrimMain} from "./brim"

jest.mock("./session", () => {
  return () => ({
    load: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    save: jest.fn(() => Promise.resolve()),
  })
})

test("reset state", async () => {
  const brim = await BrimMain.boot({
    lake: false,
  })

  await brim.start()
  await brim.resetState()

  expect(brim.session.delete).toHaveBeenCalled()
  expect(brim.session.save).not.toHaveBeenCalled()
  expect(app.relaunch).toHaveBeenCalled()
  expect(brim.isQuitting).toBe(true)
})
