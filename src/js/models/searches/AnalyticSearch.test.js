/* @flow */

import AnalyticSearch from "./AnalyticSearch"

describe("AnalyticSearch", () => {
  const program = "* | count() by _path"
  const span = [new Date(0), new Date(10)]

  let search
  beforeEach(() => {
    search = new AnalyticSearch(program, span)
  })

  test("#getProgram", () => {
    expect(search.getProgram()).toEqual("* | count() by _path | head 10000")
  })

  test("#getName", () => {
    expect(search.getName()).toEqual("AnalyticSearch")
  })
})
