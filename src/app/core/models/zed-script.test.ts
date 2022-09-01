import {ZedScript} from "./zed-script"

test("time range", () => {
  const script = new ZedScript(
    "from sample.pcap range 2022-01-01T00:00:00Z to 2022-02-01T00:00:00Z"
  )

  expect(script.range).toEqual([
    new Date(Date.UTC(2022, 0, 1, 0, 0, 0)),
    new Date(Date.UTC(2022, 1, 1, 0, 0, 0)),
  ])
})

test("number range range", () => {
  const script = new ZedScript("from sample.pcap range 0 to 100")

  expect(script.range).toEqual([0, 100])
})

test("no range", () => {
  const script = new ZedScript("from sample.pcap")

  expect(script.range).toEqual(null)
})

test("no pool", () => {
  const script = new ZedScript("hello world")

  expect(script.range).toEqual(null)
})
