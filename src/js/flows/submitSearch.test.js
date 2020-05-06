/* @flow */

import MockBoomClient from "../test/MockBoomClient"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import brim from "../brim"
import initTestStore from "../test/initTestStore"
import submitSearch from "./submitSearch"

let store, boom
beforeEach(() => {
  boom = new MockBoomClient({host: "localhost", port: 123})
  store = initTestStore(boom)
})

const spaceInfo = {
  name: "ranch-logs",
  span: {
    ts: {sec: 1425564900, ns: 0},
    dur: {sec: 3352893, ns: 750000000}
  },
  pcap_support: true
}

const initTimeWindow = () => (dispatch: Function, getState: Function) => {
  let space = Tab.space(getState())
  if (space) {
    let {min_time, max_time} = space
    dispatch(Search.setSpanArgs([min_time, max_time]))
  }
}

test("fetching a regular search", () => {
  boom.stub("search")
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Search.setSpace("ranch-logs"),
    initTimeWindow(),
    SearchBar.changeSearchBarInput("_path=conn")
  ])

  store.clearActions()
  store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("not saving a search to history", () => {
  boom.stub("search")
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Search.setSpace("ranch-logs"),
    SearchBar.changeSearchBarInput("_path=conn")
  ])

  store.clearActions()
  store.dispatch(submitSearch(false))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an analytic search", () => {
  boom.stub("search")
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Search.setSpace("ranch-logs"),
    initTimeWindow(),
    SearchBar.changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an analytic search without history", () => {
  boom.stub("search")
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Search.setSpace("ranch-logs"),
    initTimeWindow(),
    SearchBar.changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  store.dispatch(submitSearch(false))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an zoom search", () => {
  boom.stub("search")
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Search.setSpace("ranch-logs"),
    initTimeWindow(),
    Search.setSpanFocus(brim.time.convertToSpan([new Date(0), new Date(1)])),
    SearchBar.changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an zoom search without history", () => {
  boom.stub("search")
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Search.setSpace("ranch-logs"),
    initTimeWindow(),
    SearchBar.changeSearchBarInput("_path=conn | count()"),
    submitSearch()
  ])

  store.clearActions()
  store.dispatch(submitSearch(false))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("a bad search query", () => {
  boom.stub("search")
  const actions = [
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Search.setSpace("ranch-logs"),
    SearchBar.changeSearchBarInput("_ath="),
    submitSearch()
  ]
  actions.forEach(store.dispatch)

  expect(store.getActions().map((action) => action.type)).toEqual(
    expect.arrayContaining(["SEARCH_BAR_PARSE_ERROR"])
  )
})
