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
  ].map((f) => [path.normalize(path.join(testDataDir(), f)), f])

  sampleFiles.forEach(([path, name]) => {
    test(`ingest of ${name}`, async () => {
      await app.ingestFiles([path])
      await app.search(searchZql)
      const results = await app.getViewerResults()
      expect(results).toMatchSnapshot(name)
    })
  })
})
