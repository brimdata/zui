/* @flow */

import BaseSearch from "./BaseSearch"

describe("BaseSearch", () => {
  const program = "* | count() by _path"
  const span = [new Date(0), new Date(10)]

  let search
  beforeEach(() => {
    search = new BaseSearch(program, span)
  })

  test("#getName", () => {
    expect(search.getName()).toEqual("BaseSearch")
  })

  test("#getProgram", () => {
    expect(search.getProgram()).toEqual(program)
  })

  test("#getSpan", () => {
    expect(search.getSpan()).toEqual([new Date(0), new Date(10)])
  })

  test("#getReceivers", () => {
    expect(search.getReceivers(jest.fn())).toEqual([])
  })
})
