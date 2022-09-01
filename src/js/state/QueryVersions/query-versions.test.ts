/**
 * @jest-environment jsdom
 */

import QueryVersions from "."
import initTestStore from "../../../test/unit/helpers/initTestStore"
import {QueryVersion} from "./types"

let store
beforeEach(() => {
  store = initTestStore()
})

const testQueryId = "testQueryId"
const testQueryId2 = "testQueryId2"
const testVersion: QueryVersion = {
  version: "v1.0.0",
  ts: new Date(1).toISOString(),
  value: "test zed",
  pins: [],
}
const testVersion2: QueryVersion = {
  version: "v2.0.0",
  ts: new Date(2).toISOString(),
  value: "test zed",
  pins: [],
}

test("add/delete versions", () => {
  store.dispatch(QueryVersions.at(testQueryId).create(testVersion))
  const all = QueryVersions.at(testQueryId).all(store.getState())
  expect(all).toEqual([testVersion])
  store.dispatch(QueryVersions.at(testQueryId).create(testVersion2))
  expect(QueryVersions.at(testQueryId).all(store.getState())).toEqual([
    testVersion,
    testVersion2,
  ])
  store.dispatch(QueryVersions.at(testQueryId2).create(testVersion))
  expect(
    QueryVersions.at(testQueryId2).find(store.getState(), testVersion.version)
  ).toEqual(testVersion)

  store.dispatch(QueryVersions.at(testQueryId).delete(testVersion))
  expect(QueryVersions.at(testQueryId).all(store.getState())).toEqual([
    testVersion2,
  ])
})
