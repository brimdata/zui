/* @flow */

import HeadSearch from "./HeadSearch"

describe("HeadSearch", () => {
  const program = "* | head 100"
  const span = [new Date(0), new Date(10)]

  let search
  beforeEach(() => {
    search = new HeadSearch(program, span)
  })

  test("#getReceivers", () => {
    expect(search.getReceivers(jest.fn())).toHaveLength(1)
  })
})
