/**
 * @jest-environment jsdom
 */

import initTestStore from "../../../test/unit/helpers/initTestStore"
import QueryVersions, {QueryVersion} from "./index"

let store
beforeEach(() => {
  store = initTestStore()
})

const testQueryId = "testQueryId"
const testQueryId2 = "testQueryId2"
const testVersion: QueryVersion = {
  version: "v1.0.0",
  ts: new Date(),
  value: "test zed",
}
const testVersion2: QueryVersion = {
  version: "v2.0.0",
  ts: new Date(),
  value: "test zed",
}

test("add/delete versions", () => {
  store.dispatch(
    QueryVersions.add({queryId: testQueryId, version: testVersion})
  )
  expect(QueryVersions.getByQueryId(testQueryId)(store.getState())).toEqual({
    ids: [testVersion.version],
    entities: {[testVersion.version]: testVersion},
  })
  store.dispatch(
    QueryVersions.add({
      queryId: testQueryId,
      version: testVersion2,
    })
  )
  expect(QueryVersions.getByQueryId(testQueryId)(store.getState())).toEqual({
    ids: [testVersion2.version, testVersion.version],
    entities: {
      [testVersion.version]: testVersion,
      [testVersion2.version]: testVersion2,
    },
  })
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
  expect(QueryVersions.getByQueryId(testQueryId)(store.getState())).toEqual({
    ids: [testVersion2.version],
    entities: {[testVersion2.version]: testVersion2},
  })
})
