import {fetchMainSearch} from "./mainSearch"
import {changeSearchBarInput} from "./searchBar"
import {setInnerTimeWindow, setOuterTimeWindow} from "./timeWindow"
import {setSpaceInfo, setCurrentSpaceName} from "./spaces"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import rootReducer from "../reducers"

const mockStore = (initialState, api = new MockClient()) => {
  const middleware = [thunk.withExtraArgument(api)]
  return configureMockStore(middleware)(initialState)
}

const setupState = actions => {
  return actions.reduce(rootReducer, undefined)
}

const spaceInfo = {
  name: "ranch-logs",
  min_time: {sec: 1425564900, ns: 0},
  max_time: {sec: 1428917793, ns: 750000000}
}

class MockClient {
  search() {
    return this
  }
  each() {
    return this
  }
  channel() {
    return this
  }
  done() {
    return this
  }
  abort() {
    return this
  }
  error() {
    return this
  }
  abortRequest() {}
}

test("fetching an analytics search", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count()")
  ])

  const store = mockStore(state)
  store.dispatch(fetchMainSearch())

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
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count() | sort -r count"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)]),
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)])
  ])
  const api = new MockClient()
  const spy = jest.spyOn(api, "search")

  const store = mockStore(state, api)
  store.dispatch(fetchMainSearch())

  expect(spy).toBeCalledWith(
    expect.objectContaining({
      timeWindow: [new Date(2000, 0, 1), new Date(3000, 0, 1)]
    })
  )
})

test("search with inner time window if set", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)])
  ])
  const api = new MockClient()
  const search = jest.spyOn(api, "search")
  const store = mockStore(state, api)

  store.dispatch(fetchMainSearch())

  expect(search).toBeCalledWith(
    expect.objectContaining({
      timeWindow: [new Date(2015, 2, 10), new Date(2015, 2, 11)]
    })
  )
})

test("search with inner time does not ask for count by every", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)])
  ])
  const api = new MockClient()
  const search = jest.spyOn(api, "search")
  const store = mockStore(state, api)

  store.dispatch(fetchMainSearch())

  expect(search).toBeCalledWith(
    expect.objectContaining({
      string: "_path = conn | head 1000; count()"
    })
  )
})

test("search with outerTimeWindow if no inner", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path = conn"),
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)]),
    setInnerTimeWindow(null)
  ])
  const api = new MockClient()
  const search = jest.spyOn(api, "search")
  const store = mockStore(state, api)

  store.dispatch(fetchMainSearch())

  expect(search).toBeCalledWith(
    expect.objectContaining({
      timeWindow: [new Date(2000, 0, 1), new Date(3000, 0, 1)]
    })
  )
})

test("fetching an analytics does not put any procs on the query", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count()")
  ])
  const api = new MockClient()
  const search = jest.spyOn(api, "search")
  const store = mockStore(state, api)

  store.dispatch(fetchMainSearch())

  expect(search).toBeCalledWith(
    expect.objectContaining({string: "* | count()"})
  )
})

test("fetching a regular search", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path=conn")
  ])
  const store = mockStore(state)

  store.dispatch(fetchMainSearch())

  expect(store.getActions().map(action => action.type)).toEqual(
    expect.arrayContaining([
      "SEARCH_HISTORY_PUSH",
      "MAIN_SEARCH_REQUEST",
      "SHOW_LOGS_TAB"
    ])
  )
})

test("fetching a regular search puts procs on the end", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("")
  ])
  const api = new MockClient()
  const search = jest.spyOn(api, "search")
  const store = mockStore(state, api)

  store.dispatch(fetchMainSearch())

  expect(search).toBeCalledWith(
    expect.objectContaining({
      string: "* | head 1000; every 12hr count() by _path"
    })
  )
})

test("not saving a search to history", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path=conn")
  ])
  const store = mockStore(state)

  store.dispatch(fetchMainSearch({saveToHistory: false}))

  const dispatched = store.getActions().map(action => action.type)
  expect(dispatched).not.toContain("SEARCH_HISTORY_PUSH")
})

test("a bad search query", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_ath=")
  ])
  const store = mockStore(state)

  store.dispatch(fetchMainSearch())

  const dispatched = store.getActions().map(action => action.type)
  expect(dispatched).toEqual(expect.arrayContaining(["SEARCH_BAR_PARSE_ERROR"]))
})

test("starred querys", () => {
  const state = setupState([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput(":starred")
  ])
  const store = mockStore(state)

  store.dispatch(fetchMainSearch())

  const dispatched = store.getActions().map(action => action.type)
  expect(dispatched).toEqual(
    expect.arrayContaining(["MAIN_SEARCH_REQUEST", "SHOW_LOGS_TAB"])
  )
})
