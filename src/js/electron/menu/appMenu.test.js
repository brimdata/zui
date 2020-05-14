/* @flow */
import appMenu from "./appMenu"
import initTestStore from "../../test/initTestStore"

let mockSend = jest.fn()
let mockWindownManager = {}
let mockStore = initTestStore()

test("app menu mac", () => {
  // $FlowFixMe
  let menu = appMenu(mockSend, mockWindownManager, mockStore, "darwin")

  expect(menu).toMatchSnapshot()
})

test("app menu windows", () => {
  // $FlowFixMe
  let menu = appMenu(mockSend, mockWindownManager, mockStore, "win32")
  expect(menu).toMatchSnapshot()
})
