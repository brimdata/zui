/**
 * @jest-environment jsdom
 */

import React from "react"
import VersionsSection from "./versions-section"
import {lakeQueryPath} from "../../router/utils/paths"
import Queries from "src/js/state/Queries"
import QueryVersions from "src/js/state/QueryVersions"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {render, screen} from "src/test/unit/helpers"
import ResizeObserver from "resize-observer-polyfill"
import {SystemTest} from "src/test/system"

global.ResizeObserver = ResizeObserver

const system = new SystemTest("versions-section.test")

const testQueryId = "testQueryId"
const testVersion1: QueryVersion = {
  version: "v1",
  ts: new Date(1).toISOString(),
  value: "test value 1",
  pins: [],
}
const testVersion2: QueryVersion = {
  version: "v2 (latest)",
  ts: new Date(2).toISOString(),
  value: "test value 2",
  pins: [],
}

beforeEach(() => {
  system.store.dispatch(Queries.addItem({id: testQueryId, name: "test query"}))
  system.store.dispatch(QueryVersions.at(testQueryId).create(testVersion1))
  system.store.dispatch(QueryVersions.at(testQueryId).create(testVersion2))
  system.navTo(lakeQueryPath(testQueryId, "testLakeId", testVersion2.version))
  render(<VersionsSection />, {store: system.store, api: system.api})
})

test("Display query version history in order", async () => {
  const versions = screen.getAllByText(/test value/i)
  expect(versions).toHaveLength(2)
  expect(versions[0].textContent).toBe("test value 2")
})
