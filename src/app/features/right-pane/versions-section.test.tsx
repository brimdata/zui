/**
 * @jest-environment jsdom
 */

import React from "react"
import {setupBrim} from "src/test/unit/helpers/setup-brim"
import VersionsSection from "./versions-section"
import {lakeQueryPath} from "../../router/utils/paths"
import Queries from "src/js/state/Queries"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {render, screen} from "src/test/unit/helpers"
import ResizeObserver from "resize-observer-polyfill"

global.ResizeObserver = ResizeObserver

const brim = setupBrim()

const testQueryId = "testQueryId"
const testVersion1: QueryVersion = {
  version: "v1",
  ts: new Date(1).toISOString(),
  value: "test value 1",
}
const testVersion2: QueryVersion = {
  version: "v2 (latest)",
  ts: new Date(2).toISOString(),
  value: "test value 2",
}

beforeEach(() => {
  brim.dispatch(Queries.addItem({id: testQueryId, name: "test query"}))
  brim.dispatch(
    QueryVersions.add({queryId: testQueryId, version: testVersion1})
  )
  brim.dispatch(
    QueryVersions.add({queryId: testQueryId, version: testVersion2})
  )
  brim.navTo(lakeQueryPath(testQueryId, "testLakeId", testVersion2.version))
  render(<VersionsSection />, {store: brim.store})
})

test("Display query version history in order", async () => {
  const versions = screen.getAllByText(/test value/i)
  expect(versions).toHaveLength(2)
  expect(versions[0].textContent).toBe("test value 2")
})
