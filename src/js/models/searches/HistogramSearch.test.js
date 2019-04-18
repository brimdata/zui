/* @flow */

import HistogramSearch from "./HistogramSearch"

describe("HistogramSearch", () => {
  const program = "_path = conn"
  const spans = [new Date(0), new Date(10)]

  let search
  beforeEach(() => {
    search = new HistogramSearch(program, spans)
  })

  test("#getProgram", () => {
    expect(search.getProgram()).toEqual(
      "_path = conn | every 1sec count() by _path"
    )
  })
})
