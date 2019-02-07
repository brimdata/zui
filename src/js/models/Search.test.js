/* @flow */

import Search from "./Search"
import MockApi from "../test/MockApi"

describe("#send", () => {
  let api, dispatch, options

  beforeEach(() => {
    dispatch = jest.fn()
    api = new MockApi()
    options = {
      space: "default",
      program: "*",
      timeWindow: [new Date(0), new Date(1)],
      callbacks: _ => {}
    }
  })

  test("successful send", () => {
    const sender = new Search(dispatch, api, options)
    const request = sender.send()
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({type: "MAIN_SEARCH_REQUEST"})
    )
    request.onDone()
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({type: "MAIN_SEARCH_COMPLETE"})
    )
  })

  test("errors", () => {
    const sender = new Search(dispatch, api, options)
    const request = sender.send()

    request.onError("shit")

    expect(dispatch).toBeCalledWith(
      expect.objectContaining({type: "MAIN_SEARCH_REQUEST"})
    )
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({type: "NOTIFICATIONS_ADD"})
    )
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({type: "MAIN_SEARCH_COMPLETE"})
    )
  })
})
