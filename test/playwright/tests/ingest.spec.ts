import log from "electron-log"
import path from "path"
import {testDataDir} from "../helpers/env"
import TestApp from "../helpers/test-app"

describe("Ingest tests", () => {
  const app = new TestApp("Ingest tests")

  beforeAll(async () => {
    await app.init()
  })

  afterAll(async () => {
    await app.shutdown()
  })

  const searchZql =
    '_path=="conn" proto=="tcp" | cut ts, id.orig_h, id.orig_p, id.resp_h, id.resp_p, proto | sort ts'
  const sampleFiles = [
    "sample.pcap",
    "sample.pcapng",
    "sample.tsv",
    "sample.ndjson",
    "sample.zng"
  ].map((f) => ({path: path.normalize(path.join(testDataDir(), f)), name: f}))

  Object.values(sampleFiles).forEach(({path, name}) => {
    test(`ingest of ${name}`, (done) => {
      app
        .ingestFiles([path])
        .then(async () => {
          await app.search(searchZql)
          const results = await app.getViewerResults()
          expect(results).toMatchSnapshot(name)
          done()
        })
        .catch((err) => {
          log.error(err)
        })
    })
  })
})
