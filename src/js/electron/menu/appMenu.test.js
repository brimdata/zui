/* @flow */
import appMenu from "./appMenu"

let mockSend = jest.fn()
let mockWindownManager = {}

test("app menu mac", () => {
  // $FlowFixMe
  let menu = appMenu(mockSend, mockWindownManager, "darwin")

  expect(menu).toMatchSnapshot()
})

test("app menu windows", () => {
  // $FlowFixMe
  let menu = appMenu(mockSend, mockWindownManager, "win32")
  expect(menu).toMatchSnapshot()
})
