import "src/test/system/real-paths"
import appMenu from "./appMenu"
import {BrimMain} from "../brim"

const mockSend = jest.fn()

test("app menu mac", async () => {
  Object.defineProperty(process, "platform", {value: "darwin"})
  const brim = await BrimMain.boot({
    lake: false,
    devtools: false,
    autoUpdater: false,
  })
  const menu = appMenu(mockSend, brim)

  expect(menu).toMatchSnapshot()
})

test("app menu windows", async () => {
  Object.defineProperty(process, "platform", {value: "win32"})
  const brim = await BrimMain.boot({
    lake: false,
    devtools: false,
    autoUpdater: false,
  })
  const menu = appMenu(mockSend, brim)

  expect(menu).toMatchSnapshot()
})
