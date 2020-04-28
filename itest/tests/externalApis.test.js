/* @flow */
import https from "https"

import {retry} from "../lib/control"
import {TestTimeout} from "../lib/jest"
import ZeekLogDescriptions from "../../src/js/services/zeekLogDescriptions"
import brim from "../../src/js/brim"
import virusTotal from "../../src/js/services/virusTotal"

jest.setTimeout(TestTimeout)

test("ping virus total for a success", () => {
  let value = "80.239.217.49"
  let url = virusTotal.url(value)

  function makeRequest() {
    return new Promise((good, bad) => {
      https.get(url, (res) => {
        res.statusCode === 200 ? good() : bad()
      })
    })
  }

  return retry(makeRequest, 5)
})

describe("doc urls", () => {
  const stripSuffix = (s) => s.replace("_log", "")
  const buildUrl = (s) => [s, brim.zeekLogInfo(s).docsUrl()]
  const request = (path, url) =>
    new Promise((good, bad) => {
      https
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
      test(`doc url responds 200 for ${path}`, () =>
        retry(() => request(path, url), 5))
    })
})
