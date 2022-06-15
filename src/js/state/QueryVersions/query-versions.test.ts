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
}
const testVersion2: QueryVersion = {
  version: "v2.0.0",
  ts: new Date(2).toISOString(),
  value: "test zed",
}

test("add/delete versions", () => {
  store.dispatch(
    QueryVersions.add({queryId: testQueryId, version: testVersion})
  )
  expect(QueryVersions.getByQueryId(testQueryId)(store.getState())).toEqual([
    testVersion,
  ])
  store.dispatch(
    QueryVersions.add({
      queryId: testQueryId,
      version: testVersion2,
    })
  )
  expect(QueryVersions.getByQueryId(testQueryId)(store.getState())).toEqual([
    testVersion,
    testVersion2,
  ])
  store.dispatch(
    QueryVersions.add({
      queryId: testQueryId2,
      version: testVersion,
    })
  )
  expect(
    QueryVersions.getByVersion(
      testQueryId2,
      testVersion.version
    )(store.getState())
  ).toEqual(testVersion)

  store.dispatch(
    QueryVersions.delete({queryId: testQueryId, version: testVersion.version})
  )
  expect(QueryVersions.getByQueryId(testQueryId)(store.getState())).toEqual([
    testVersion2,
  ])
})
