/* @flow */

import Handlers from "../state/Handlers"
import initTestStore from "../test/initTestStore"

describe("Handlers reducer", () => {
  let store

  beforeEach(() => {
    store = initTestStore()
  })

  function createHandler(abortFn) {
    return {
      type: "SEARCH",
      abort: abortFn
    }
  }

  test("#abort all", () => {
    let killFunc = jest.fn()

    store.dispatchAll([
      Handlers.register("Histogram", createHandler(killFunc)),
      Handlers.register("Logs", createHandler(killFunc)),
      Handlers.abortAll()
    ])

    expect(killFunc).toHaveBeenCalledTimes(2)
  })

  test("#abort", () => {
    let killFunc = jest.fn()

    store.dispatchAll([
      Handlers.register("Histogram", createHandler(killFunc)),
      Handlers.register("Logs", createHandler(killFunc)),
      Handlers.abort("Histogram")
    ])

    expect(killFunc).toHaveBeenCalledTimes(1)
  })
})
