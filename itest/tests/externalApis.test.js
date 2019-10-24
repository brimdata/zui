/* @flow */
import https from "https"
import external from "../../src/js/external"
import {retry} from "../lib/control"

test("ping virus total for a success", () => {
  let value = "80.239.217.49"
  let url = external.virusTotalUrl(value)

  function makeRequest() {
    return new Promise((good, bad) => {
      https.get(url, (res) => {
        res.statusCode === 200 ? good() : bad()
      })
    })
  }

  return retry(makeRequest, 5)
})
