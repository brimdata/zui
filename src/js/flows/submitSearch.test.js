/* @flow */

import {createZealotMock} from "zealot"

import Current from "../state/Current"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import brim from "../brim"
import initTestStore from "../test/initTestStore"
import submitSearch from "./submitSearch"

let store, zealot
beforeEach(() => {
  zealot = createZealotMock()
  store = initTestStore(zealot)
  zealot.stubStream("search", [{type: "TaskStart"}, {type: "TaskEnd"}])
})

const spaceInfo = {
  id: "ranch-id",
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

test("fetching a regular search", async () => {
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Current.setSpaceId("ranch-id"),
    initTimeWindow(),
    SearchBar.changeSearchBarInput("_path=conn")
  ])

  store.clearActions()
  await store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("not saving a search to history", async () => {
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Current.setSpaceId("ranch-id"),
    SearchBar.changeSearchBarInput("_path=conn")
  ])

  store.clearActions()
  await store.dispatch(submitSearch({history: false, investigation: false}))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an analytic search", async () => {
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Current.setSpaceId("ranch-id"),
    initTimeWindow(),
    SearchBar.changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  await store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an analytic search without history", async () => {
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Current.setSpaceId("ranch-id"),
    initTimeWindow(),
    SearchBar.changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  await store.dispatch(submitSearch({history: false, investigation: false}))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an zoom search", async () => {
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Current.setSpaceId("ranch-id"),
    initTimeWindow(),
    Search.setSpanFocus(brim.time.convertToSpan([new Date(0), new Date(1)])),
    SearchBar.changeSearchBarInput("_path=conn | count()")
  ])

  store.clearActions()
  await store.dispatch(submitSearch())

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("fetching an zoom search without history", async () => {
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Current.setSpaceId("ranch-id"),
    initTimeWindow(),
    SearchBar.changeSearchBarInput("_path=conn | count()"),
    submitSearch()
  ])

  store.clearActions()
  await store.dispatch(submitSearch({history: false, investigation: false}))

  expect(store.getActions().map((a) => a.type)).toMatchSnapshot()
})

test("a bad search query", () => {
  store.dispatchAll([
    Search.setCluster("1"),
    Spaces.setDetail("1", spaceInfo),
    Current.setSpaceId("ranch-id"),
    SearchBar.changeSearchBarInput("_ath=")
  ])

  store.dispatch(submitSearch()).catch((e) => e)

  expect(store.getActions().map((action) => action.type)).toEqual(
    expect.arrayContaining(["SEARCH_BAR_PARSE_ERROR"])
  )
})
