import appMenu from "./appMenu"
import {BrimMain} from "../brim"

const mockSend = jest.fn()

test("app menu mac", async () => {
  Object.defineProperty(process, "platform", {value: "darwin"})
  const menu = appMenu(mockSend, new BrimMain())

  expect(menu).toMatchSnapshot()
})

test("app menu windows", async () => {
  Object.defineProperty(process, "platform", {value: "win32"})
  const menu = appMenu(mockSend, new BrimMain())

  expect(menu).toMatchSnapshot()
})
