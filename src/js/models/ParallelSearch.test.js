/* @flow */

import {Handler} from "../BoomClient"
import ParallelSearch from "./ParallelSearch"

describe("ParallelSearch", () => {
  let search1, search2, dispatch
  beforeEach(() => {
    search1 = jest.fn(() => new Handler(() => {}))
    search2 = jest.fn(() => new Handler(() => {}))
    // $FlowFixMe
    dispatch = jest.fn(val => val())
  })

  test("#send", () => {
    new ParallelSearch(dispatch, [search1, search2]).send()

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(search1).toHaveBeenCalled()
    expect(search2).toHaveBeenCalled()
  })

  test("#kill", () => {
    const searchAbort = jest.fn()
    const requestAbort = jest.fn()
    const search1 = jest.fn(() => new Handler(searchAbort))

    new ParallelSearch(dispatch, [search1])
      .abort(requestAbort)
      .send()
      .kill()

    expect(searchAbort).toHaveBeenCalled()
    expect(requestAbort).toHaveBeenCalled()
  })

  test("#done", () => {
    const allDone = jest.fn()
    const handler1 = new Handler()
    const handler2 = new Handler()

    new ParallelSearch(dispatch, [() => handler1, () => handler2])
      .done(allDone)
      .send()

    handler1.onDone()
    expect(allDone).not.toHaveBeenCalled()
    handler2.onDone()
    expect(allDone).toHaveBeenCalled()
  })

  test("#error", () => {
    const error = jest.fn()
    const handler1 = new Handler()
    const handler2 = new Handler()

    new ParallelSearch(dispatch, [() => handler1, () => handler2])
      .error(error)
      .send()

    handler1.onError("Fun")
    handler2.onError("Time")

    expect(error).toHaveBeenNthCalledWith(1, "Fun")
    expect(error).toHaveBeenNthCalledWith(2, "Time")
  })
})
