import path from "path"
import {testDataDir} from "../helpers/env"
import TestApp from "../helpers/test-app"
import {sprintf} from "sprintf-js"

describe("Ingest tests", () => {
  const app = new TestApp("Query tests")

  const simpleQueries = [
    "* | count()",
    "* | count() by _path | sort _path",
    '_path=="conn" | count()',
    '_path=="conn" | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts',
    "* | every 2s count() | sort ts",
    "* | every 2s count() by _path | sort ts, _path",
    '_path=="x509" or _path=="ssl" | sort _path'
  ]

  beforeAll(async () => {
    await app.init()
    await app.ingestFiles([
      path.normalize(path.join(testDataDir(), "sample.tsv"))
    ])
  })

  afterAll(async () => {
    await app.shutdown()
  })

  for (let i = 0; i < simpleQueries.length; i++) {
    const zql = simpleQueries[i]
    const testId = sprintf("%03d", i)
    test(`query${testId}: "${zql}"`, async () => {
      await app.search(zql)
      const results = await app.getViewerResults()
      expect(results).toMatchSnapshot()
    })
  }
})
