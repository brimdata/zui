import ingest from "./"
import data from "test/shared/data"

const json = data.getDOMFile("sample.ndjson")
const pcap = data.getDOMFile("sample.pcap")
const pcapng = data.getDOMFile("sample.pcapng")
const unknown = data.getDOMFile("plain.txt")
const zeek = data.getDOMFile("sample.tsv")

test("add file types", async () => {
  const files = [pcap, pcapng, zeek, json, unknown]
  const types = await ingest.detectFileTypes(files)

  expect(types).toEqual([
    {type: "pcap", file: pcap},
    {type: "pcap", file: pcapng},
    {type: "log", file: zeek},
    {type: "log", file: json},
    {type: "log", file: unknown}
  ])
})
