import {fetchMainSearch} from "./mainSearch"
import {changeSearchBarInput} from "./searchBar"
import {setInnerTimeWindow, setOuterTimeWindow} from "./timeWindow"
import {setSpaceInfo, setCurrentSpaceName} from "./spaces"
import reducer from "../reducers"

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
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("* | count()")
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()

  fetchMainSearch()(dispatch, getState, api)

  const dispatched = dispatch.mock.calls.map(([action]) => action.type)
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
    setOuterTimeWindow([new Date(2000, 0, 1), new Date(3000, 0, 1)])
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()
  const search = jest.fn()
  api.search = (...args) => {
    search(...args)
    return api
  }

  fetchMainSearch()(dispatch, getState, api)

  expect(search).toBeCalledWith(
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
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)])
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()
  const search = jest.fn()
  api.search = (...args) => {
    search(...args)
    return api
  }

  fetchMainSearch()(dispatch, getState, api)

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
    setInnerTimeWindow([new Date(2015, 2, 10), new Date(2015, 2, 11)])
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()
  const search = jest.fn()
  api.search = (...args) => {
    search(...args)
    return api
  }

  fetchMainSearch()(dispatch, getState, api)

  expect(search).toBeCalledWith(
    expect.objectContaining({
      string: "_path = conn | head 1000"
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
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()
  const search = jest.fn()
  api.search = (...args) => {
    search(...args)
    return api
  }

  fetchMainSearch()(dispatch, getState, api)

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
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()
  const search = jest.fn()
  api.search = (...args) => {
    search(...args)
    return api
  }

  fetchMainSearch()(dispatch, getState, api)

  expect(search).toBeCalledWith(
    expect.objectContaining({string: "* | count()"})
  )
})

test("fetching a regular search", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path=conn")
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()

  fetchMainSearch()(dispatch, getState, api)

  const dispatched = dispatch.mock.calls.map(([action]) => action.type)
  expect(dispatched).toEqual(
    expect.arrayContaining([
      "SEARCH_HISTORY_PUSH",
      "MAIN_SEARCH_REQUEST",
      "SHOW_LOGS_TAB",
      "COUNT_BY_TIME_REQUEST"
    ])
  )
})

test("fetching a regular search puts procs on the end", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("")
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()
  const search = jest.fn()
  api.search = (...args) => {
    search(...args)
    return api
  }

  fetchMainSearch()(dispatch, getState, api)

  expect(search).toBeCalledWith(
    expect.objectContaining({
      string: "* | head 1000; every 12hr count() by _path"
    })
  )
})

test("not saving a search to history", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path=conn")
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()

  fetchMainSearch({saveToHistory: false})(dispatch, getState, api)

  const dispatched = dispatch.mock.calls.map(([action]) => action.type)
  expect(dispatched).not.toContain("SEARCH_HISTORY_PUSH")
})

test("a bad search query", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_ath=")
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()

  fetchMainSearch()(dispatch, getState, api)

  const dispatched = dispatch.mock.calls.map(([action]) => action.type)
  expect(dispatched).toEqual(expect.arrayContaining(["SEARCH_BAR_PARSE_ERROR"]))
})

test("starred querys", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput(":starred")
  ]
  const state = actions.reduce(reducer, {})
  const getState = () => state
  const dispatch = jest.fn()
  const api = new MockClient()

  fetchMainSearch()(dispatch, getState, api)

  const dispatched = dispatch.mock.calls.map(([action]) => action.type)
  expect(dispatched).toEqual(
    expect.arrayContaining(["MAIN_SEARCH_REQUEST", "SHOW_LOGS_TAB"])
  )
})
