/**
 * @jest-environment jsdom
 */

import ingest from "./"
import data from "src/test/shared/data"

const json = data.getWebFile("sample.ndjson")
const pcap = data.getWebFile("sample.pcap")
const pcapng = data.getWebFile("sample.pcapng")
const unknown = data.getWebFile("plain.txt")
const zeek = data.getWebFile("sample.tsv")

test("add file types", async () => {
  const files = [pcap, pcapng, zeek, json, unknown]

  const types = await ingest.detectFileTypes(files)

  expect(types).toEqual([
    {type: "pcap", file: pcap},
    {type: "pcap", file: pcapng},
    {type: "log", file: zeek},
    {type: "log", file: json},
    {type: "log", file: unknown},
  ])
})
