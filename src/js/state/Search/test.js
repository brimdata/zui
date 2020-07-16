/* @flow */

import {createZealotMock} from "../../services/zealot"
import Search from "./"
import Tab from "../Tab"
import brim from "../../brim"
import initTestStore from "../../test/initTestStore"
import submitSearch from "../../flows/submitSearch"

let ts1 = {sec: 1, ns: 0}
let ts2 = {sec: 2, ns: 1}
let ts3 = {sec: 3, ns: 2}
let ts4 = {sec: 4, ns: 3}

describe("reducer", () => {
  let store

  beforeEach(() => {
    store = initTestStore(createZealotMock().stubStream("search", []))
  })

  test("set span", () => {
    let state = store.dispatchAll([Search.setSpan([ts1, ts2])])
    expect(Tab.getSpan(state)).toEqual([ts1, ts2])
  })

  test("set span focus", () => {
    let state = store.dispatchAll([Search.setSpanFocus([ts3, ts4])])
    expect(Tab.getSpanFocus(state)).toEqual([ts3, ts4])
  })

  test("set span focus to null", () => {
    let state = store.dispatchAll([Search.setSpanFocus(null)])
    expect(Tab.getSpanFocus(state)).toEqual(null)
  })

  test("set span args", () => {
    let state = store.dispatchAll([Search.setSpanArgs([ts1, "now"])])
    expect(Tab.getSpanArgs(state)).toEqual([ts1, "now"])
  })

  test("compute span", () => {
    let now = new Date(2000, 3, 12, 12, 30)
    let state = store.dispatchAll([
      Search.setSpanArgs(["now - 5m", "now"]),
      Tab.computeSpan(now)
    ])
    let from = brim
      .time(now)
      .subtract(5, "minutes")
      .toTs()
    let to = brim.time(now).toTs()

    expect(Tab.getSpan(state)).toEqual([from, to])
  })

  test("search ts when saved to history", () => {
    let ts = Tab.getSearchTs(store.getState())

    let now = new Date()
    expect(ts).toBe(0)
    store.dispatch(submitSearch({history: true, investigation: true}, now))
    expect(Tab.getSearchTs(store.getState())).toBe(now.getTime())
  })

  test("search ts when not saved to history", () => {
    let ts = Tab.getSearchTs(store.getState())

    let now = new Date()
    expect(ts).toBe(0)
    store.dispatch(submitSearch({history: false, investigation: false}, now))
    expect(Tab.getSearchTs(store.getState())).toBe(now.getTime())
  })
})

describe("selectors", () => {
  let store

  beforeEach(() => {
    store = initTestStore()
  })

  test("getArgs", () => {
    let state = store.getState()

    expect(Search.getArgs(state)).toEqual({
      chartProgram: "* | every 1sec count() by _path",
      spaceId: "",
      spaceName: "",
      span: [new Date(0), new Date(1000)],
      tableProgram: "* | head 500",
      type: "events"
    })
  })
})
