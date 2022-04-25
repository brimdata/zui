import {decodeSearchParams, encodeSearchParams} from "./search-params"

test("encode search path", () => {
  const path = encodeSearchParams({
    program: "_path=conn",
    pins: ["191.0.1.2"],
    spanArgs: [
      {
        ns: 0,
        sec: 100,
      },
      {ns: 0, sec: 200},
    ],
  })
  expect(path).toEqual("q=_path%3Dconn&from=100.0&to=200.0&p0=191.0.1.2")
})

test("decode search path", () => {
  const path = "q=_path%3Dconn&from=100.0&to=200.0&lake=123&p0=191.0.1.2"
  const record = decodeSearchParams(path)

  expect(record).toEqual({
    program: "_path=conn",
    spanArgs: [
      {sec: 100, ns: 0},
      {sec: 200, ns: 0},
    ],
    pins: ["191.0.1.2"],
  })
})

test("decode with negative time", () => {
  const path = "from=-1800.1000000&to=0.1000000"
  const record = decodeSearchParams(path)

  expect(record.spanArgs).toEqual([
    {sec: -1800, ns: 1000000},
    {sec: 0, ns: 1000000},
  ])
})
