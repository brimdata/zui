/* @flow */

import {appendViewerRecords, spliceViewer} from "../state/viewer/actions"
import {fetchNextPage} from "./fetchNextPage"
import {setCurrentSpaceName} from "../state/actions"
import Log from "../models/Log"
import MockBoomClient from "../test/MockBoomClient"
import initTestStore from "../test/initTestStore"
import search from "../state/search"

const tuples = [["1", "100"], ["1", "200"], ["1", "300"]]
const descriptor = [{name: "_td", type: "string"}, {name: "ts", type: "time"}]

let store, boom
beforeEach(() => {
  boom = new MockBoomClient().stub("search")
  store = initTestStore(boom)
  store.dispatchAll([
    setCurrentSpaceName("default"),
    search.setSpanArgsFromDates([new Date(0), new Date(10 * 1000)]),
    search.computeSpan(),
    appendViewerRecords(tuples.map((t) => new Log(t, descriptor)))
  ])
  store.clearActions()
})

test("#fetchNextPage dispatches splice", () => {
  store.dispatch(fetchNextPage())

  expect(store.getActions()).toEqual(
    expect.arrayContaining([{type: "VIEWER_SPLICE", index: 2}])
  )
})

test("#fetchNextPage adds 1ms to ts of last change", () => {
  const search = jest.spyOn(boom, "search")
  store.dispatch(fetchNextPage())

  const lastChangeTs = tuples[1][1]
  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      searchSpan: [new Date(0), new Date(+lastChangeTs * 1000 + 1)]
    })
  )
})

test("#fetchNextPage when there is only 1 event", () => {
  const search = jest.spyOn(boom, "search")
  store.dispatch(spliceViewer(1))
  store.dispatch(fetchNextPage())

  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      searchSpan: [new Date(0), new Date(10 * 1000)]
    })
  )
})
