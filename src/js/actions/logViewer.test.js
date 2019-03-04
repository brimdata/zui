import {Handler} from "../BoomClient"
import MockBoomClient from "../test/MockBoomClient"
import * as descriptors from "../actions/descriptors"
import initStore from "../test/initStore"
import * as logViewer from "./logViewer"
import * as mainSearch from "../actions/mainSearch"
import * as spaces from "../actions/spaces"
import * as timeWindow from "./timeWindow"

const tuples = [["1", "100"], ["1", "200"], ["1", "300"]]
const descriptor = [{name: "_td", type: "string"}, {name: "ts", type: "time"}]

let store, boom, handler
beforeEach(() => {
  boom = new MockBoomClient()
  boom.search = () => new Handler()
  store = initStore(boom)
  store.dispatchAll([
    spaces.setCurrentSpaceName("default"),
    timeWindow.setOuterTimeWindow([new Date(0), new Date(10 * 1000)]),
    descriptors.receiveDescriptor("default", 1, descriptor),
    mainSearch.mainSearchEvents(tuples)
  ])
  store.clearActions()
})

test("#fetchAhead dispatches is fetching true", () => {
  store.dispatch(logViewer.fetchAhead())

  expect(store.getActions()).toEqual([
    {type: "LOG_VIEWER_IS_FETCHING_AHEAD_SET", value: true}
  ])
})

test("#fetchAhead dispatches splice and new logs", () => {
  store.dispatch(logViewer.fetchAhead())
  handler.channelCallback(0, {
    type: "SearchResult",
    results: {tuples: [["1", "300"], ["1", "400"], ["1", "500"]]}
  })
  handler.channelCallback(0, {type: "SearchEnd"})

  expect(store.getActions()).toEqual(
    expect.arrayContaining([
      {type: "MAIN_SEARCH_EVENTS_SPLICE", index: 2},
      {
        type: "MAIN_SEARCH_EVENTS",
        events: [["1", "300"], ["1", "400"], ["1", "500"]]
      }
    ])
  )
})

test("#fetchAhead sets more ahead to false if tuple count < per page", () => {
  store.dispatch(logViewer.fetchAhead())
  handler.channelCallback(0, {
    type: "SearchResult",
    results: {tuples: [["1", "300"], ["1", "400"], ["1", "500"]]}
  })
  handler.channelCallback(0, {type: "SearchEnd"})

  expect(store.getActions()).toEqual(
    expect.arrayContaining([{type: "LOG_VIEWER_MORE_AHEAD_SET", value: false}])
  )
})

test("#fetchAhead sets isFetching to false when done", done => {
  store.dispatch(logViewer.fetchAhead())
  handler.channelCallback(0, {
    type: "SearchResult",
    results: {tuples: [["1", "300"], ["1", "400"], ["1", "500"]]}
  })
  handler.channelCallback(0, {type: "SearchEnd"})

  handler.onDone()
  setTimeout(() => {
    expect(store.getActions()).toContainEqual({
      type: "LOG_VIEWER_IS_FETCHING_AHEAD_SET",
      value: false
    })
    done()
  }, 501)
})

test.only("#fetchAhead adds 1ms to ts of last change", () => {
  const search = jest.spyOn(boom, "search")
  store.dispatch(logViewer.fetchAhead())

  const lastChangeTs = tuples[1][1]
  expect(search).toBeCalledWith(
    expect.any(String),
    expect.objectContaining({
      searchSpan: [new Date(+lastChangeTs * 1000 + 1), new Date(10 * 1000)]
    })
  )
})

test("#fetchAhead when there is only 1 event", () => {
  const search = jest.spyOn(boom, "search")
  store.dispatch(mainSearch.spliceMainSearchEvents(1))
  store.dispatch(logViewer.fetchAhead())

  expect(search).toBeCalledWith(
    expect.objectContaining({
      timeWindow: [new Date(0), new Date(10 * 1000)]
    })
  )
})
