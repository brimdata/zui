/* @flow */

import AnalyticSearch from "./AnalyticSearch"

describe("BaseSearch", () => {
  const program = "* | count() by _path"
  const span = [new Date(0), new Date(10)]

  let search
  beforeEach(() => {
    search = new AnalyticSearch(program, span)
  })

  test("#getProgram", () => {
    expect(search.getProgram()).toEqual("* | count() by _path")
  })

  test("#getSpan", () => {
    expect(search.getSpan()).toEqual([new Date(0), new Date(10)])
  })

  test("#getReceivers", () => {
    expect(search.getReceivers(jest.fn())).toHaveLength(1)
  })
})
