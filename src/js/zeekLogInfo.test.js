/* @flow */
import http from "http"

import ZeekLogDescriptions from "./services/zeekLogDescriptions"
import brim from "./brim"

test("describe conn uid", () => {
  let path = brim.zeekLogInfo("conn")
  let desc = path.describeColumn("uid")

  expect(desc).toBe("A unique identifier of the connection.")
})

test("known path", () => {
  let path = brim.zeekLogInfo("conn")

  expect(path.isKnown()).toBe(true)
})

test("unknown path", () => {
  let path = brim.zeekLogInfo("nopath")
  expect(path.isKnown()).toBe(false)
})

describe("doc urls", () => {
  const stripSuffix = (s) => s.replace("_log", "")
  const buildUrl = (s) => [s, brim.zeekLogInfo(s).docsUrl()]
  const request = (path, url) =>
    new Promise((good, bad) => {
      http
        // $FlowFixMe
        .request(url, {method: "HEAD"}, (res) => {
          if (res.statusCode === 200) good()
          else bad(`${res.statusCode}: ${path}${url}`)
        })
        .end()
    })

  Object.keys(ZeekLogDescriptions)
    .map(stripSuffix)
    .map(buildUrl)
    .forEach(([path, url]) => {
      test(`doc url responds 200 for ${path}`, () => request(path, url))
    })
})
