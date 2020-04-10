/* @flow */

import path from "path"

import ingest from "./"

const testFile = (name) => path.join(__dirname, "../../../../itest/", name)
const pcap = testFile("sample.pcap")
const zeek = testFile("sample.zeek.log")
const json = testFile("sample.json.zeek.log")
const unknown = testFile("setup.js")

test("add file types", async () => {
  let paths = [pcap, zeek, json, unknown]
  let types = await ingest.detectFileTypes(paths)

  expect(types).toEqual([
    {type: "pcap", path: pcap},
    {type: "zeek", path: zeek},
    {type: "json", path: json},
    {type: "unknown", path: unknown}
  ])
})
