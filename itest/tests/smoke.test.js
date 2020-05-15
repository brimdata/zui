/* @flow */

import path from "path"

import {handleError, stdTest} from "../lib/jest.js"
import {ingestFile, pcapIngestSample} from "../lib/app"
import {
  newAppInstance,
  searchDisplay,
  startApp,
  startSearch,
  waitForNewTab,
  writeSearch
} from "../lib/app.js"

describe("Smoke test", () => {
  let app
  let testIdx = 0
  beforeEach(() => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    return startApp(app)
  })

  afterEach(async () => {
    if (app && app.isRunning()) {
      return await app.stop()
    }
  })

  stdTest("show the new tab page when you log in", (done) => {
    waitForNewTab(app)
      .then(() => done())
      .catch((err) => handleError(app, err, done))
  })

  stdTest("pcap ingest", (done) => {
    const searchZql =
      "_path=conn proto=tcp | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts"

    pcapIngestSample(app)
      .then(async () => {
        await writeSearch(app, searchZql)
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

  stdTest("log ingest", (done) => {
    const searchZql =
      "_path=conn proto=tcp | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts"

    ingestFile(
      app,
      path.normalize(path.join(__dirname, "..", "testdata", "sample.tsv"))
    )
      .then(async () => {
        await writeSearch(app, searchZql)
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
})
