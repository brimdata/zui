/* @flow */

import HistogramSearch from "./HistogramSearch"

describe("BaseSearch", () => {
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

  test("#getSpan", () => {
    expect(search.getSpan()).toEqual([new Date(0), new Date(10)])
  })

  test("#getReceivers", () => {
    expect(search.getReceivers(jest.fn())).toHaveLength(1)
  })
})
