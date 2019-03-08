/* @flow */

import HeadSearch from "./HeadSearch"

describe("HeadSearch", () => {
  const program = "* | head 100"
  const span = [new Date(0), new Date(10)]

  let search
  beforeEach(() => {
    search = new HeadSearch(program, span)
  })

  test("#getProgram", () => {
    expect(search.getProgram()).toEqual(program)
  })

  test("#getSpan", () => {
    expect(search.getSpan()).toEqual([new Date(0), new Date(10)])
  })

  test("#getReceivers", () => {
    expect(search.getReceivers(jest.fn())).toHaveLength(1)
  })
})
