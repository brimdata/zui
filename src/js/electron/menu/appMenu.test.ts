import appMenu from "./appMenu"
import {BrimMain} from "../brim"

const mockSend = jest.fn()

test("app menu mac", async () => {
  const menu = appMenu(mockSend, new BrimMain(), "darwin")

  expect(menu).toMatchSnapshot()
})

test("app menu windows", async () => {
  const menu = appMenu(mockSend, new BrimMain(), "win32")

  expect(menu).toMatchSnapshot()
})
