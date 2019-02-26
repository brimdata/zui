import {BoomClient} from "boom-js-client"

import {changeSearchBarInput} from "./searchBar"
import {fetchMainSearch} from "./mainSearch"
import {setSpaceInfo, setCurrentSpaceName} from "./spaces"
import MockApi from "../test/MockApi"
import initStore from "../test/initStore"
import timeWindow, {
  init,
  setInnerTimeWindow,
  setOuterTimeWindow
} from "./timeWindow"

const spaceInfo = {
  name: "ranch-logs",
  min_time: {sec: 1425564900, ns: 0},
  max_time: {sec: 1428917793, ns: 750000000}
}

test("fetching an analytics search", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count()"),
    fetchMainSearch()
  ]

  const store = initStore(new MockApi())
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
  const store = initStore()
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count() | sort -r count"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)]),
    fetchMainSearch()
  ])

  expect(BoomClient.prototype.send).toBeCalledWith(
    expect.any(Object),
    expect.objectContaining({
      searchSpan: [new Date(2000, 0, 1), new Date(3000, 0, 1)]
    })
  )
})

test("search with inner time window if set", () => {
  const store = initStore()
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    fetchMainSearch()
  ])
  expect(BoomClient.prototype.send).toBeCalledWith(
    expect.any(Object),
    expect.objectContaining({
      searchSpan: [new Date(2015, 2, 10), new Date(2015, 2, 11)]
    })
  )
})

test("search with inner time does not ask for count by every", () => {
  const spy = jest.spyOn(BoomClient.prototype, "search")

  const store = initStore()
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    fetchMainSearch()
  ])

  expect(spy).toBeCalledWith("_path = conn | head 800; count()")
})

test("search with a provided head proc", () => {
  const store = initStore()
  const search = jest.spyOn(BoomClient.prototype, "search")

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    init(),
    changeSearchBarInput("_path = conn | head 45"),
    fetchMainSearch()
  ])

  expect(search).toBeCalledWith(
    "_path = conn | head 45; every 12hr count() by _path"
  )
})

test("search with outerTimeWindow if no inner", () => {
  const store = initStore()

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)]),
    setInnerTimeWindow(null),
    fetchMainSearch()
  ])

  expect(BoomClient.prototype.send).toBeCalledWith(
    expect.any(Object),
    expect.objectContaining({
      searchSpan: [new Date(2000, 0, 1), new Date(3000, 0, 1)]
    })
  )
})

test("fetching an analytics does not put any procs on the query", () => {
  const search = jest.spyOn(BoomClient.prototype, "search")

  const store = initStore()

  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count()"),
    fetchMainSearch()
  ])

  expect(search).toBeCalledWith("* | count()")
})

test("fetching a regular search", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    init(),
    changeSearchBarInput("_path=conn"),
    fetchMainSearch()
  ]
  const store = initStore(new MockApi())
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
  const search = jest.spyOn(BoomClient.prototype, "search")
  initStore().dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    init(),
    changeSearchBarInput(""),
    fetchMainSearch()
  ])

  expect(search).toBeCalledWith("* | head 800; every 12hr count() by _path")
})

test("not saving a search to history", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    init(),
    changeSearchBarInput("_path=conn"),
    fetchMainSearch({saveToHistory: false})
  ]
  const store = initStore(new MockApi())
  actions.forEach(store.dispatch)

  const dispatched = store.getActions().map(action => action.type)
  expect(dispatched).not.toContain("SEARCH_HISTORY_PUSH")
})

test("a bad search query", () => {
  const store = initStore()
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
  const store = initStore()
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
