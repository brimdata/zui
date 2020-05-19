/* @flow */

import path from "path"

import {handleError, stdTest} from "../lib/jest.js"
import {testDataDir} from "../lib/env"
import {ingestFile, pcapIngestSample} from "../lib/app"
import {
  newAppInstance,
  searchDisplay,
  startApp,
  startSearch,
  writeSearch
} from "../lib/app.js"

describe("Ingest tests", () => {
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

    ingestFile(app, path.join(testDataDir(), "sample.tsv"))
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
