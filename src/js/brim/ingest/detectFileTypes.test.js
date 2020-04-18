/* @flow */

import ingest from "./"
import itestFile from "../../test/itestFile"

const json = itestFile("sample.ndjson")
const pcap = itestFile("sample.pcap")
const pcapng = itestFile("sample.pcapng")
const unknown = itestFile("setup.js")
const zeek = itestFile("sample.tsv")

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
