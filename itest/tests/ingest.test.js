/* @flow */

import path from "path"

import {handleError, stdTest} from "../lib/jest.js"
import {
  ingestFile,
  newAppInstance,
  searchDisplay,
  startApp,
  startSearch,
  writeSearch
} from "../lib/app"

describe("Ingest tests", () => {
  let app
  let testIdx = 0
  beforeAll(() => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    return startApp(app)
  })

  afterAll(async () => {
    if (app && app.isRunning()) {
      return await app.stop()
    }
  })

  const searchZql =
    "_path=conn proto=tcp | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts"
  const sampleFiles = [
    "sample.pcap",
    "sample.pcapng",
    "sample.tsv",
    "sample.ndjson",
    "sample.zng"
  ]

  sampleFiles.forEach((fileName) => {
    stdTest(`ingest of ${fileName}`, (done) => {
      ingestFile(app, fileName)
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
})
