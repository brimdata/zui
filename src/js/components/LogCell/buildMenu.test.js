/* @flow */

import {changeSearchBarInput, submitSearchBar} from "../../actions/searchBar"
import {conn, dns, weird} from "../../test/mockLogs"
import {setCurrentSpaceName, setSpaceInfo} from "../../actions/spaces"
import {showAnalyticsTab, showLogsTab} from "../../actions/view"
import MockBoomClient from "../../test/MockBoomClient"
import buildMenu from "./buildMenu"
import initStore from "../../test/initStore"
import mockSpace from "../../test/mockSpace"

let store, space, boom
beforeEach(() => {
  boom = new MockBoomClient()
  store = initStore(boom)
  space = mockSpace()
})

describe("Log Right Click", () => {
  beforeEach(() => {
    store.dispatchAll([
      setSpaceInfo(space),
      setCurrentSpaceName(space.name),
      showLogsTab()
    ])
  })

  test("conn log with pcap support", () => {
    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = buildMenu(store.getState(), {log, field})

    expect(menu).toMatchSnapshot()
  })

  test("conn log without pcap support", () => {
    space.packet_support = false
    store.dispatch(setSpaceInfo(space))
    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = buildMenu(store.getState(), {log, field})

    expect(menu).toMatchSnapshot()
  })

  test("dns log", () => {
    const log = dns()
    const field = log.getField("query")
    const menu = buildMenu(store.getState(), {log, field})

    expect(menu).toMatchSnapshot()
  })

  test("time field for weird log", () => {
    const log = weird()
    const field = log.getField("ts")
    const menu = buildMenu(store.getState(), {log, field})

    expect(menu).toMatchSnapshot()
  })

  test("time field for conn log", () => {
    const log = conn()
    const field = log.getField("ts")
    const menu = buildMenu(store.getState(), {log, field})

    expect(menu).toMatchSnapshot()
  })
})

describe("Analysis Right Click", () => {
  beforeEach(() => {
    store.dispatchAll([
      setSpaceInfo(space),
      setCurrentSpaceName(space.name),
      showAnalyticsTab()
    ])
  })

  test("address field", () => {
    const log = conn()
    const field = log.getField("id.orig_h")
    const menu = buildMenu(store.getState(), {log, field})

    expect(menu).toMatchSnapshot()
  })

  test("non-address field", () => {
    const log = conn()
    const field = log.getField("proto")
    const menu = buildMenu(store.getState(), {log, field})

    expect(menu).toMatchSnapshot()
  })

  test("group by proc", () => {
    boom.stubStream("search")
    store.dispatchAll([
      changeSearchBarInput("* | count() by _path"),
      submitSearchBar()
    ])

    const log = conn()
    const field = log.getField("proto")
    const menu = buildMenu(store.getState(), {log, field})

    expect(menu).toMatchSnapshot()
  })
})
