import {createZealotMock} from "zealot"

import Spaces from "../state/Spaces"
import fixtures from "../test/fixtures"
import responses from "../test/responses"
import initTestStore from "../test/initTestStore"
import submitAutoRefreshSearch from "./submitAutoRefreshSearch"
import Workspaces from "../state/Workspaces"
import {lakePath} from "app/router/utils/paths"

const viewer = responses("dns.txt")
const histogram = responses("count_by_path.txt")
const space = fixtures("space1")

let store, zealot, dispatch
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot.zealot)
  dispatch = store.dispatch
  zealot.stubStream("search", histogram).stubStream("search", viewer)
  store.dispatchAll([
    Workspaces.add({
      host: "testHost",
      id: "1",
      name: "testName",
      port: "9867",
      authType: "none"
    }),
    Spaces.setDetail("1", space)
  ])
  global.tabHistory.push(lakePath(space.id, "1"))
})

test("auto refresh does not clear previous results", async () => {
  store.clearActions()
  await dispatch(submitAutoRefreshSearch())
  expect(store.getActions().map((a) => a.type)).not.toContain("VIEWER_CLEAR")
})

test("sets records instead of appending them", async () => {
  store.clearActions()
  await dispatch(submitAutoRefreshSearch())
  expect(store.getActions().map((a) => a.type)).toContain("VIEWER_SET_RECORDS")
})
