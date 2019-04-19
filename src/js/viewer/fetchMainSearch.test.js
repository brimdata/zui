/* @flow */

import {
  changeSearchBarInput,
  setCurrentSpaceName,
  setSpaceInfo
} from "../state/actions"
import {fetchMainSearch} from "./fetchMainSearch"
import {initTimeWindow} from "../state/thunks/timeWindow"
import MockBoomClient from "../test/MockBoomClient"
import initTestStore from "../test/initTestStore"

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
  boom.stubStream("stream")
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    initTimeWindow(),
    changeSearchBarInput("_path=conn"),
    fetchMainSearch()
  ]

  actions.forEach(store.dispatch)

  expect(store.getActions().map((action) => action.type)).toEqual(
    expect.arrayContaining([
      "SEARCH_HISTORY_PUSH",
      "RESULTS_CLEAR",
      "SHOW_LOGS_TAB"
    ])
  )
})

test("not saving a search to history", (done) => {
  boom.stubStream("stream")
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_path=conn"),
    fetchMainSearch({saveToHistory: false})
  ]

  actions.forEach(store.dispatch)

  setTimeout(() => {
    const dispatched = store.getActions().map((action) => action.type)
    expect(dispatched).not.toContain("SEARCH_HISTORY_PUSH")
    done()
  })
})

test("a bad search query", () => {
  const actions = [
    setSpaceInfo(spaceInfo),
    setCurrentSpaceName("ranch-logs"),
    changeSearchBarInput("_ath="),
    fetchMainSearch()
  ]
  actions.forEach(store.dispatch)

  expect(store.getActions().map((action) => action.type)).toEqual(
    expect.arrayContaining(["SEARCH_BAR_PARSE_ERROR"])
  )
})
