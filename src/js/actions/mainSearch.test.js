import {fetchMainSearch} from "./mainSearch"
import {changeSearchBarInput} from "./searchBar"
import {setInnerTimeWindow, setOuterTimeWindow} from "./timeWindow"
import {setSpaceInfo, setCurrentSpaceName} from "./spaces"
import * as timeWindow from "./timeWindow"
import MockApi from "../test/MockApi"
import initStore from "../test/initStore"

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
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count() | sort -r count"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)]),
    fetchMainSearch()
  ]

  const api = new MockApi()
  const spy = jest.spyOn(api, "search")
  const store = initStore(api)
  actions.forEach(store.dispatch)

  expect(spy).toBeCalledWith(
    expect.objectContaining({
      timeWindow: [new Date(2000, 0, 1), new Date(3000, 0, 1)]
    })
  )
})

test("search with inner time window if set", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    fetchMainSearch()
  ]
  const api = new MockApi()
  const search = jest.spyOn(api, "search")
  const store = initStore(api)
  actions.map(store.dispatch)

  expect(search).toBeCalledWith(
    expect.objectContaining({
      timeWindow: [new Date(2015, 2, 10), new Date(2015, 2, 11)]
    })
  )
})

test("search with inner time does not ask for count by every", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    fetchMainSearch()
  ]
  const api = new MockApi()
  const search = jest.spyOn(api, "search")
  const store = initStore(api)
  actions.map(store.dispatch)

  expect(search).toBeCalledWith(
    expect.objectContaining({
      string: "_path = conn | head 200; count()"
    })
  )
})

test("search with a provided head proc", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    timeWindow.init(),
    changeSearchBarInput("_path = conn | head 45"),
    fetchMainSearch()
  ]

  const api = new MockApi()
  const search = jest.spyOn(api, "search")
  const store = initStore(api)
  actions.forEach(store.dispatch)

  expect(search).toBeCalledWith(
    expect.objectContaining({
      string: "_path = conn | head 45; every 12hr count() by _path"
    })
  )
})

test("search with outerTimeWindow if no inner", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)]),
    setInnerTimeWindow(null)
  ]
  const api = new MockApi()
  const search = jest.spyOn(api, "search")
  const store = initStore(api)
  actions.map(store.dispatch)

  store.dispatch(fetchMainSearch())

  expect(search).toBeCalledWith(
    expect.objectContaining({
      timeWindow: [new Date(2000, 0, 1), new Date(3000, 0, 1)]
    })
  )
})

test("fetching an analytics does not put any procs on the query", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count()")
  ]
  const api = new MockApi()
  const search = jest.spyOn(api, "search")
  const store = initStore(api)
  actions.map(store.dispatch)

  store.dispatch(fetchMainSearch())

  expect(search).toBeCalledWith(
    expect.objectContaining({string: "* | count()"})
  )
})

test("fetching a regular search", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    timeWindow.init(),
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
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    timeWindow.init(),
    changeSearchBarInput(""),
    fetchMainSearch()
  ]
  const api = new MockApi()
  const search = jest.spyOn(api, "search")
  const store = initStore(api)
  actions.map(store.dispatch)

  expect(search).toBeCalledWith(
    expect.objectContaining({
      string: "* | head 200; every 12hr count() by _path"
    })
  )
})

test("not saving a search to history", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    timeWindow.init(),
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
