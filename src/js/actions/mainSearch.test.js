import {changeSearchBarInput} from "./searchBar"
import {fetchMainSearch} from "./mainSearch"
import {init, setInnerTimeWindow, setOuterTimeWindow} from "./timeWindow"
import {setSpaceInfo, setCurrentSpaceName} from "./spaces"
import MockBoomClient from "../test/MockBoomClient"
import initStore from "../test/initStore"

let store, boom

beforeEach(() => {
  boom = new MockBoomClient({host: "localhost", port: 123})
  store = initStore(boom)
})

const spaceInfo = {
  name: "ranch-logs",
  min_time: {sec: 1425564900, ns: 0},
  max_time: {sec: 1428917793, ns: 750000000}
}

test("fetching an analytics search", () => {
  boom.stubStream("send")

  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count()"),
    fetchMainSearch()
  ]

  actions.forEach(store.dispatch)

  const dispatched = store.getActions().map(action => action.type)
  expect(dispatched).toEqual(
    expect.arrayContaining([
      "SEARCH_HISTORY_PUSH",
      "MAIN_SEARCH_REQUEST",
      "SHOW_ANALYTICS_TAB"
    ])
  )
})

test("analytics always use the outer time window", () => {
  boom.stubStream("send")
  const send = jest.spyOn(boom, "send")

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count() | sort -r count"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)]),
    fetchMainSearch()
  ])

  expect(send).toBeCalledWith(
    expect.any(Object),
    expect.objectContaining({
      searchSpan: [new Date(2000, 0, 1), new Date(3000, 0, 1)]
    })
  )
})

test("search with inner time window if set", () => {
  boom.stubStream("send")
  const send = jest.spyOn(boom, "send")

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    fetchMainSearch()
  ])

  expect(send).toBeCalledWith(
    expect.any(Object),
    expect.objectContaining({
      searchSpan: [new Date(2015, 2, 10), new Date(2015, 2, 11)]
    })
  )
})

test("search with inner time", () => {
  boom.stubStream("search")
  const search = jest.spyOn(boom, "search")

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    fetchMainSearch()
  ])

  expect(search).toBeCalledWith("_path = conn | head 800", expect.any(Object))
})

test("search with a provided head proc", () => {
  boom.stubStream("search")
  const search = jest.spyOn(boom, "search")

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    init(),
    changeSearchBarInput("_path = conn | head 45"),
    fetchMainSearch()
  ])

  expect(search).toBeCalledWith("_path = conn | head 45", expect.any(Object))
})

test("search with outerTimeWindow if no inner", () => {
  boom.stubStream("send")
  const send = jest.spyOn(boom, "send")

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)]),
    setInnerTimeWindow(null),
    fetchMainSearch()
  ])

  expect(send).toBeCalledWith(
    expect.any(Object),
    expect.objectContaining({
      searchSpan: [new Date(2000, 0, 1), new Date(3000, 0, 1)]
    })
  )
})

test("fetching an analytics does not put any procs on the query", () => {
  boom.stubStream("search")
  const search = jest.spyOn(boom, "search")

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count()"),
    fetchMainSearch()
  ])

  expect(search).toBeCalledWith("* | count()", expect.any(Object))
})

test("fetching a regular search", () => {
  boom.stubStream("send")
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    init(),
    changeSearchBarInput("_path=conn"),
    fetchMainSearch()
  ]

  actions.forEach(store.dispatch)

  expect(store.getActions().map(action => action.type)).toEqual(
    expect.arrayContaining([
      "SEARCH_HISTORY_PUSH",
      "MAIN_SEARCH_REQUEST",
      "SHOW_LOGS_TAB"
    ])
  )
})

test("fetching a regular search puts procs on the end", () => {
  boom.stubStream("search")
  const search = jest.spyOn(boom, "search")

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    init(),
    changeSearchBarInput(""),
    fetchMainSearch()
  ])

  expect(search).toBeCalledWith("* | head 800", expect.any(Object))
})

test("not saving a search to history", () => {
  boom.stubStream("send")
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    init(),
    changeSearchBarInput("_path=conn"),
    fetchMainSearch({saveToHistory: false})
  ]

  actions.forEach(store.dispatch)

  const dispatched = store.getActions().map(action => action.type)
  expect(dispatched).not.toContain("SEARCH_HISTORY_PUSH")
})

test("a bad search query", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_ath="),
    fetchMainSearch()
  ]
  actions.forEach(store.dispatch)

  expect(store.getActions().map(action => action.type)).toEqual(
    expect.arrayContaining(["SEARCH_BAR_PARSE_ERROR"])
  )
})

test("starred querys", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput(":starred"),
    fetchMainSearch()
  ]
  actions.forEach(store.dispatch)

  expect(store.getActions().map(action => action.type)).toEqual(
    expect.arrayContaining(["MAIN_SEARCH_REQUEST", "SHOW_LOGS_TAB"])
  )
})
