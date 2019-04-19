/* @flow */

import {cancelSearchesByTag, killSearchesByTag} from "./cancelSearch"
import {clearSearches, registerSearch} from "../state/searches/actions"
import Handler from "../BoomClient/lib/Handler"
import initTestStore from "../test/initTestStore"

describe("boomSearches reducer", () => {
  let store

  beforeEach(() => {
    store = initTestStore()
    store.dispatchAll([
      registerSearch("Histogram", {tag: "viewer", handler: new Handler()}),
      registerSearch("Logs", {tag: "detail", handler: new Handler()})
    ])
  })

  test("#killSearchesByTag", () => {
    const killFunc = jest.fn()
    store.dispatchAll([
      clearSearches(),
      registerSearch("Histogram", {
        handler: new Handler(killFunc),
        tag: "detail"
      }),
      registerSearch("Logs", {
        handler: new Handler(killFunc),
        tag: "detail"
      }),
      killSearchesByTag()
    ])

    expect(killFunc).toHaveBeenCalledTimes(2)
  })

  test("#killSearchesByTag by tag", () => {
    const killFunc = jest.fn()
    store.dispatchAll([
      clearSearches(),
      registerSearch("Histogram", {
        tag: "detail",
        handler: new Handler(killFunc)
      }),
      registerSearch("Logs", {
        tag: "viewer",
        handler: new Handler(killFunc)
      }),
      killSearchesByTag("viewer")
    ])

    expect(killFunc).toHaveBeenCalledTimes(1)
  })

  test("#killSearchesByTag runs abort callback", () => {
    const handler = new Handler(jest.fn())

    const func = jest.spyOn(handler, "abortRequest")

    store.dispatchAll([
      clearSearches(),
      registerSearch("KillMe", {handler, tag: "viewer"}),
      killSearchesByTag()
    ])

    expect(func).toHaveBeenCalledWith()
  })

  test("#cancelSearches does not run abort callback", () => {
    const handler = new Handler(jest.fn())

    const func = jest.spyOn(handler, "abortRequest")

    store.dispatchAll([
      clearSearches(),
      registerSearch("Cancel Me", {handler, tag: "detail"}),
      cancelSearchesByTag()
    ])

    expect(func).toHaveBeenCalledWith(false)
  })
})
