/* @flow */

import {basename} from "path"

import {sprintf} from "sprintf-js"

import {
  newAppInstance,
  pcapIngestSample,
  searchDisplay,
  setSpan,
  startApp,
  startSearch,
  waitForResults,
  writeSearch
} from "../lib/app.js"
import {handleError, stdTest} from "../lib/jest.js"

const simpleQueries = [
  "* | count()",
  "* | count() by _path | sort _path",
  "_path=conn | count()",
  "_path=conn | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts",
  "* | every 2s count() | sort ts",
  "* | every 2s count() by _path | sort ts, _path"
]

describe("Query tests", () => {
  let app
  let testIdx = 0

  beforeAll(async () => {
    app = newAppInstance(basename(__filename), ++testIdx)
    await startApp(app)
    await pcapIngestSample(app)
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  beforeEach(async () => {
    await setSpan(app, "Whole Space")
    await writeSearch(app, "")
    await waitForResults(app)
  })

  for (let i = 0; i < simpleQueries.length; i++) {
    let zql = simpleQueries[i]
    let testId = sprintf("%03d", i)
    stdTest(`query${testId}: "${zql}"`, (done) => {
      writeSearch(app, zql)
        .then(async () => {
          await startSearch(app)
          return searchDisplay(app)
        })
        .then((results) => {
          expect(results).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    })
  }
})
