/* @flow */

import {
  changeSearchBarInput,
  setCurrentSpaceName,
  setSpaceInfo
} from "../state/actions"
import {initTimeWindow} from "../state/thunks/timeWindow"
import {setInnerTimeWindow} from "../state/search/actions"
import MockBoomClient from "../test/MockBoomClient"
import brim from "../brim"
import initTestStore from "../test/initTestStore"
import search from "../state/search"
import submitSearch from "./submitSearch"

let store, boom
beforeEach(() => {
  boom = new MockBoomClient({host: "localhost", port: 123})
  store = initTestStore(boom)
})

const spaceInfo = {
  name: "ranch-logs",
  min_time: {sec: 1425564900, ns: 0},
  max_time: {sec: 1428917793, ns: 750000000}
}

test("fetching a regular search", () => {
  boom.stub("search")
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    initTimeWindow(),
    changeSearchBarInput("_path=conn")
  ])

  store.clearActions()
  store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("not saving a search to history", () => {
  boom.stub("search")
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path=conn")
  ])

  store.clearActions()
  store.dispatch(submitSearch(false))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an analytic search", () => {
  boom.stub("search")
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    initTimeWindow(),
    changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an analytic search without history", () => {
  boom.stub("search")
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    initTimeWindow(),
    changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  store.dispatch(submitSearch(false))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an zoom search", () => {
  boom.stub("search")
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    initTimeWindow(),
    search.setSpanFocus(brim.time.convertToSpan([new Date(0), new Date(1)])),
    changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an zoom search without history", () => {
  boom.stub("search")
  store.dispatchAll([
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    initTimeWindow(),
    setInnerTimeWindow([new Date(0), new Date(1)]),
    changeSearchBarInput("_path=conn | count()"),
    submitSearch()
  ])

  store.clearActions()
  store.dispatch(submitSearch(false))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("a bad search query", () => {
  boom.stub("search")
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_ath="),
    submitSearch()
  ]
  actions.forEach(store.dispatch)

  expect(store.getActions().map((action) => action.type)).toEqual(
    expect.arrayContaining(["SEARCH_BAR_PARSE_ERROR"])
  )
})
