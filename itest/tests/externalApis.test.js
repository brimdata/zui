/* @flow */
import https from "https"

import {retry} from "../lib/control"
import virusTotal from "../../src/js/services/virusTotal"

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
