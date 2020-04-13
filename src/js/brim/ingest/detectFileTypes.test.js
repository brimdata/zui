/* @flow */

import path from "path"

import ingest from "./"

const testFile = (name) => path.join(__dirname, "../../../../itest/", name)
const pcap = testFile("sample.pcap")
const pcapng = testFile("sample.pcapng")
const zeek = testFile("sample.tsv")
const json = testFile("sample.ndjson")
const unknown = testFile("setup.js")

test("add file types", async () => {
  let paths = [pcap, pcapng, zeek, json, unknown]
  let types = await ingest.detectFileTypes(paths)

  expect(types).toEqual([
    {type: "pcap", path: pcap},
    {type: "pcap", path: pcapng},
    {type: "zeek", path: zeek},
    {type: "json", path: json},
    {type: "unknown", path: unknown}
  ])
})
