/* @flow */

import {conn} from "../test/mockLogs"
import actions from "./actions"
import initTestStore from "../test/initTestStore"

test("#detail first shows right pane, then views log", () => {
  const store = initTestStore()
  actions.detail(conn(), {enabled: true}).click(store.dispatch)

  expect(store.getActions().map((a) => a.type)).toEqual(
    expect.arrayContaining(["RIGHT_SIDEBAR_SHOW", "LOG_DETAIL_PUSH"])
  )
})
