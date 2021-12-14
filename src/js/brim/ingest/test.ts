import ingest from "./index"

const fakeFile = (path: string, name: string): File => {
  const f = new File([], name)
  f.path = path
  return f
}

test("one pcap default", () => {
  const data = ingest.getParams([
    {type: "pcap", file: fakeFile("/work/my.pcap", "my.pcap")}
  ])

  expect(data).toEqual({
    name: "my.pcap",
    fileListData: [{type: "pcap", file: fakeFile("/work/my.pcap", "my.pcap")}]
  })
})

test("one zeek log default", () => {
  const data = ingest.getParams([
    {type: "log", file: fakeFile("/work/zeek.log", "zeek.log")}
  ])

  expect(data).toEqual({
    name: "zeek.log",
    fileListData: [{type: "log", file: fakeFile("/work/zeek.log", "zeek.log")}]
  })
})

test("two zeek logs in same dir default", () => {
  const data = ingest.getParams([
    {type: "log", file: fakeFile("/work/zeek-1.log", "zeek-1.log")},
    {type: "log", file: fakeFile("/work/zeek-2.log", "zeek-2.log")}
  ])

  expect(data).toEqual({
    name: "work",
    fileListData: [
      {type: "log", file: fakeFile("/work/zeek-1.log", "zeek-1.log")},
      {type: "log", file: fakeFile("/work/zeek-2.log", "zeek-2.log")}
    ]
  })
})

test("two zeek logs in different dir default", () => {
  const data = ingest.getParams(
    [
      {type: "log", file: fakeFile("/work/day-1/zeek.log", "zeek.log")},
      {type: "log", file: fakeFile("/work/day-2/zeek.log", "zeek.log")}
    ],
    [],
    new Date(0)
  )

  expect(data).toEqual({
    name: "pool_1970-01-01_00:00:00",

    fileListData: [
      {type: "log", file: fakeFile("/work/day-1/zeek.log", "zeek.log")},
      {type: "log", file: fakeFile("/work/day-2/zeek.log", "zeek.log")}
    ]
  })
})
