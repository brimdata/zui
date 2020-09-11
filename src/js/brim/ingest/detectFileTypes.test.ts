import ingest from "./"
import itestFile from "../../test/itestFile"

const json = itestFile("sample.ndjson")
const pcap = itestFile("sample.pcap")
const pcapng = itestFile("sample.pcapng")
const unknown = itestFile("plain.txt")
const zeek = itestFile("sample.tsv")

test("add file types", async () => {
  const paths = [pcap, pcapng, zeek, json, unknown]
  const types = await ingest.detectFileTypes(paths)

  expect(types).toEqual([
    {type: "pcap", path: pcap},
    {type: "pcap", path: pcapng},
    {type: "log", path: zeek},
    {type: "log", path: json},
    {type: "log", path: unknown}
  ])
})
