/* @flow */
import BoomClient from "../"
import "whatwg-fetch"

let boom
beforeEach(() => {
  boom = new BoomClient({
    host: "boom.com",
    port: 123,
    searchSpan: [new Date(0), new Date(1)]
  })
})

test("#inspectSearch", () => {
  const info = boom.inspectSearch("* | count()", {enableCache: false})

  expect(info).toEqual({
    method: "POST",
    url: "http://boom.com:123/search?rewrite=f",
    body: {
      proc: {
        op: "SequentialProc",
        procs: [
          {
            op: "SourceProc",
            filter: {
              op: "BooleanLiteral",
              value: true
            }
          },
          {
            op: "ReducerProc",
            reducers: [
              {
                op: "Count",
                var: "count"
              }
            ]
          }
        ]
      },
      space: "default",
      dir: -1,
      span: {ts: {sec: 0, ns: 0}, dur: {sec: 0, ns: 1000000}}
    }
  })
})

test("#searching with BrowserFetch adapter includes options", () => {
  const fetchFunc = jest.spyOn(window, "fetch")
  boom.setOptions({adapter: "BrowserFetch", enableCache: false})

  boom.search("*")

  expect(fetchFunc).toHaveBeenCalledWith(
    "http://boom.com:123/search?rewrite=f",
    expect.any(Object)
  )
})
