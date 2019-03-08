/* @flow */

import LogSearch from "./LogSearch"

describe("BaseSearch", () => {
  const program = "_path = conn"
  const span = [new Date(0), new Date(10)]

  let base
  beforeEach(() => {
    base = new LogSearch(program, span)
  })

  test("#getProgram", () => {
    expect(base.getProgram()).toEqual("_path = conn | head 800")
  })

  test("#getSpan", () => {
    expect(base.getSpan()).toEqual([new Date(0), new Date(10)])
  })

  test("#getReceivers", () => {
    expect(base.getReceivers(jest.fn())).toHaveLength(2)
  })
})
