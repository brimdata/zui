/* @flow */
import {conn} from "../test/mockLogs"
import MockBoomClient from "../test/MockBoomClient"
import executeUidSearch from "./executeUidSearch"
import initTestStore from "../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("dispatches request", () => {
  let log = conn()
  store.dispatch(executeUidSearch(log))
})
