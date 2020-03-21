/* @flow */

import Handlers from "../state/Handlers"
import MockBoomClient from "../test/MockBoomClient"
import initTestStore from "../test/initTestStore"

describe("boomSearches reducer", () => {
  let store, boom

  beforeEach(() => {
    boom = new MockBoomClient().stub("send")
    store = initTestStore(boom)
  })

  function createHandler(boom) {
    return {
      type: "SEARCH",
      abort: (val) => boom.abort(val)
    }
  }

  test("#abort all", () => {
    let killFunc = jest.fn()
    let req1 = boom.mockRequest()
    let req2 = boom.mockRequest()

    req1.setAbort(killFunc)
    req2.setAbort(killFunc)

    store.dispatchAll([
      Handlers.register("Histogram", createHandler(req1)),
      Handlers.register("Logs", createHandler(req2)),
      Handlers.abortAll()
    ])

    expect(killFunc).toHaveBeenCalledTimes(2)
  })

  test("#abort", () => {
    let killFunc = jest.fn()
    let req1 = boom.mockRequest()
    let req2 = boom.mockRequest()

    req1.setAbort(killFunc)
    req2.setAbort(killFunc)

    store.dispatchAll([
      Handlers.register("Histogram", createHandler(req1)),
      Handlers.register("Logs", createHandler(req2)),
      Handlers.abort("Histogram")
    ])

    expect(killFunc).toHaveBeenCalledTimes(1)
  })

  test("#abortAll runs callback", () => {
    let req = boom.mockRequest()
    let killFunc = jest.spyOn(req, "abort")

    store.dispatchAll([
      Handlers.register("KillMe", createHandler(req)),
      Handlers.abortAll()
    ])

    expect(killFunc).toHaveBeenCalled()
  })

  test("#abortAll does not run abort callback", () => {
    let req = boom.mockRequest()
    let killFunc = jest.spyOn(req, "abort")

    store.dispatchAll([
      Handlers.register("Cancel Me", createHandler(req)),
      Handlers.abortAll(false)
    ])

    expect(killFunc).toHaveBeenCalledWith(false)
  })
})
