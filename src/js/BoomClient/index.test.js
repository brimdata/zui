/* @flow */

import BoomClient from "./"

let boom
beforeEach(() => {
  boom = new BoomClient({
    host: "localhost",
    port: 9867,
    adapter: "NodeRequest"
  })
})

test("#constructor with no options", () => {
  expect(boom.getOptions()).toEqual({
    enableCache: true,
    enableIndex: true,
    adapter: expect.any(String),
    host: "localhost",
    password: "",
    port: 9867,
    searchQueryParams: {},
    searchSpace: "default",
    searchSpan: [expect.any(Date), expect.any(Date)],
    timeout: 0,
    username: ""
  })
})

test("#setOptions", () => {
  boom.setOptions({port: 1111})

  const {host, port} = boom.getOptions()

  expect(host).toBe("localhost")
  expect(port).toBe(1111)
})

test("#clientVersion", () => {
  expect(boom.clientVersion()).toHaveProperty("zq")
})
