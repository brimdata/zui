/* @flow */
import appMenu from "./appMenu"
import initTestStore from "../../test/initTestStore"
import tron from "../tron"

let mockSend = jest.fn()
let mockWindownManager = {}
let mockStore = initTestStore()

test("app menu mac", async () => {
  let mockSession = await tron.session()
  let menu = appMenu(
    mockSend,
    // $FlowFixMe
    mockWindownManager,
    mockStore,
    mockSession,
    "darwin"
  )

  expect(menu).toMatchSnapshot()
})

test("app menu windows", async () => {
  let mockSession = await tron.session()

  let menu = appMenu(
    mockSend,
    // $FlowFixMe
    mockWindownManager,
    mockStore,
    mockSession,
    "win32"
  )
  expect(menu).toMatchSnapshot()
})
