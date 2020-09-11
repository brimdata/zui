import appMenu from "./appMenu"
import initTestStore from "../../test/initTestStore"
import tron from "../tron"
import {$WindowManager} from "../tron/windowManager"

const mockSend = jest.fn()
const mockWindownManager = {} as $WindowManager
const mockStore = initTestStore()

test("app menu mac", async () => {
  const mockSession = await tron.session()
  const menu = appMenu(
    mockSend,
    mockWindownManager,
    mockStore,
    mockSession,
    "darwin"
  )

  expect(menu).toMatchSnapshot()
})

test("app menu windows", async () => {
  const mockSession = await tron.session()

  const menu = appMenu(
    mockSend,
    mockWindownManager,
    mockStore,
    mockSession,
    "win32"
  )
  expect(menu).toMatchSnapshot()
})
