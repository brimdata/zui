/* @flow */
import {conn} from "../test/mockLogs"
import {createZealotMock} from "zealot"
import executeUidSearch from "./executeUidSearch"
import initTestStore from "../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore(createZealotMock().stubStream("search", []))
})

test("dispatches request", async () => {
  let log = conn()
  await store.dispatch(executeUidSearch(log))
})
