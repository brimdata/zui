/* @flow */

import {createZealotMock} from "zealot"

import {response} from "./submitSearch/responses/mod"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import fixtures from "../test/fixtures"
import initTestStore from "../test/initTestStore"
import submitAutoRefreshSearch from "./submitAutoRefreshSearch"

const anyResp = response("dns.txt")
const space = fixtures("space1")

let store, zealot, dispatch
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot)
  dispatch = store.dispatch
  zealot.stubStream("search", anyResp)
  store.dispatchAll([
    Current.setConnectionId("1"),
    Spaces.setDetail("1", space),
    Current.setSpaceId(space.id)
  ])
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
