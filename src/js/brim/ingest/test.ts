import ingest from "./"

const fakeFile = (path: string): File => {
  const f = new File([], "fake")
  f.path = path
  return f
}

test("one pcap default", () => {
  const data = ingest.getParams([
    {type: "pcap", file: fakeFile("/work/my.pcap")}
  ])

  expect(data).toEqual({
    dataDir: "",
    name: "my.pcap",
    fileListData: [{type: "pcap", file: fakeFile("/work/my.pcap")}]
  })
})

test("one zeek log default", () => {
  const data = ingest.getParams([
    {type: "log", file: fakeFile("/work/zeek.log")}
  ])

  expect(data).toEqual({
    name: "zeek.log",
    dataDir: "",
    fileListData: [{type: "log", file: fakeFile("/work/zeek.log")}]
  })
})

test("two zeek logs in same dir default", () => {
  const data = ingest.getParams([
    {type: "log", file: fakeFile("/work/zeek-1.log")},
    {type: "log", file: fakeFile("/work/zeek-2.log")}
  ])

  expect(data).toEqual({
    name: "work",
    dataDir: "",
    fileListData: [
      {type: "log", file: fakeFile("/work/zeek-1.log")},
      {type: "log", file: fakeFile("/work/zeek-2.log")}
    ]
  })
})

test("two zeek logs in different dir default", () => {
  const data = ingest.getParams(
    [
      {type: "log", file: fakeFile("/work/day-1/zeek.log")},
      {type: "log", file: fakeFile("/work/day-2/zeek.log")}
    ],
    "",
    [],
    new Date(0)
  )

  expect(data).toEqual({
    name: "zeek_1969-12-31_16:00:00",
    dataDir: "",
    fileListData: [
      {type: "log", file: fakeFile("/work/day-1/zeek.log")},
      {type: "log", file: fakeFile("/work/day-2/zeek.log")}
    ]
  })
})
