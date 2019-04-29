/* @flow */

import {cancelSearchesByTag, killSearchesByTag} from "./cancelSearch"
import {clearSearches, registerSearch} from "../state/searches/actions"
import MockBoomClient from "../test/MockBoomClient"
import initTestStore from "../test/initTestStore"

describe("boomSearches reducer", () => {
  let store, boom

  beforeEach(() => {
    boom = new MockBoomClient().stub("send")
    store = initTestStore(boom)
    store.dispatchAll([
      registerSearch("Histogram", {tag: "viewer", handler: boom.mockRequest()}),
      registerSearch("Logs", {tag: "detail", handler: boom.mockRequest()})
    ])
  })

  test("#killSearchesByTag", () => {
    let killFunc = jest.fn()
    let req1 = boom.mockRequest()
    let req2 = boom.mockRequest()

    req1.setAbort(killFunc)
    req2.setAbort(killFunc)

    store.dispatchAll([
      clearSearches(),
      registerSearch("Histogram", {
        handler: req1,
        tag: "detail"
      }),
      registerSearch("Logs", {
        handler: req2,
        tag: "detail"
      }),
      killSearchesByTag()
    ])

    expect(killFunc).toHaveBeenCalledTimes(2)
  })

  test("#killSearchesByTag by tag", () => {
    let killFunc = jest.fn()
    let req1 = boom.mockRequest()
    let req2 = boom.mockRequest()

    req1.setAbort(killFunc)
    req2.setAbort(killFunc)

    store.dispatchAll([
      clearSearches(),
      registerSearch("Histogram", {
        tag: "detail",
        handler: req1
      }),
      registerSearch("Logs", {
        tag: "viewer",
        handler: req2
      }),
      killSearchesByTag("viewer")
    ])

    expect(killFunc).toHaveBeenCalledTimes(1)
  })

  test("#killSearchesByTag runs abort callback", () => {
    let req = boom.mockRequest()
    let killFunc = jest.spyOn(req, "abort")

    store.dispatchAll([
      clearSearches(),
      registerSearch("KillMe", {handler: req, tag: "viewer"}),
      killSearchesByTag()
    ])

    expect(killFunc).toHaveBeenCalled()
  })

  test("#cancelSearches does not run abort callback", () => {
    let req = boom.mockRequest()
    let killFunc = jest.spyOn(req, "abort")

    store.dispatchAll([
      clearSearches(),
      registerSearch("Cancel Me", {handler: req, tag: "detail"}),
      cancelSearchesByTag()
    ])

    expect(killFunc).toHaveBeenCalledWith(false)
  })
})
