import {test, expect} from "@playwright/test"
import path from "path"
import {testDataDir} from "../helpers/env"
import TestApp from "../helpers/test-app"
import {sprintf} from "sprintf-js"

const testQueries = [
  {
    zed: "* | count()",
    expectedStats: {results: "Results: 1", shapes: "Shapes: 1"},
  },
  {
    zed: "* | count() by _path | sort _path",
    expectedStats: {results: "Results: 8", shapes: "Shapes: 1"},
  },
  {
    zed: '_path=="conn" | count()',
    expectedStats: {results: "Results: 1", shapes: "Shapes: 1"},
  },
  {
    zed: '_path=="conn" | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts',
    expectedStats: {results: "Results: 19", shapes: "Shapes: 1"},
  },
  {
    zed: '_path=="x509" or _path=="ssl" | sort _path',
    expectedStats: {results: "Results: 2", shapes: "Shapes: 2"},
  },
]

test.describe("Ingest tests", () => {
  const app = new TestApp("Ingest tests")

  test.beforeAll(async () => {
    await app.init()
    await app.createPool([
      path.normalize(path.join(testDataDir(), "sample.tsv")),
    ])
    await app.mainWin
      .locator('#app-root button:above(:text("Query Pool"))')
      .first()
      .click()
  })

  test.afterAll(async () => {
    await app.shutdown()
  })

  testQueries.forEach(({zed, expectedStats}, i) => {
    const testId = sprintf("%03d", i)
    test(`query${testId}: "${zed}"`, async () => {
      await app.query(zed)
      const resultStats = await app.getViewerStats()
      expect(resultStats).toEqual(expectedStats)
    })
  })
})
