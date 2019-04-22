/* @flow */

import {conn} from "../test/mockLogs"
import {detail} from "./actions"
import initTestStore from "../test/initTestStore"

test("#detail first shows right pane, then views log", () => {
  const store = initTestStore()
  detail(conn()).onClick(store.dispatch)

  expect(store.getActions().map((a) => a.type)).toEqual([
    "RIGHT_SIDEBAR_SHOW",
    "LOG_DETAIL_PUSH",
    "SEARCH_REGISTER"
  ])
})
