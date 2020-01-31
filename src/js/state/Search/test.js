/* @flow */

import Search from "./"
import brim from "../../brim"
import initTestStore from "../../test/initTestStore"
import tab from "../Tab"

let ts1 = {sec: 1, ns: 0}
let ts2 = {sec: 2, ns: 1}
let ts3 = {sec: 3, ns: 2}
let ts4 = {sec: 4, ns: 3}

describe("reducer", () => {
  let store

  beforeEach(() => {
    store = initTestStore()
  })

  test("set span", () => {
    let state = store.dispatchAll([Search.setSpan([ts1, ts2])])
    expect(tab.getSpan(state)).toEqual([ts1, ts2])
  })

  test("set span focus", () => {
    let state = store.dispatchAll([Search.setSpanFocus([ts3, ts4])])
    expect(tab.getSpanFocus(state)).toEqual([ts3, ts4])
  })

  test("set span focus to null", () => {
    let state = store.dispatchAll([Search.setSpanFocus(null)])
    expect(tab.getSpanFocus(state)).toEqual(null)
  })

  test("set span args", () => {
    let state = store.dispatchAll([Search.setSpanArgs([ts1, "now"])])
    expect(tab.getSpanArgs(state)).toEqual([ts1, "now"])
  })

  test("compute span", () => {
    let now = new Date(2000, 3, 12, 12, 30)
    let state = store.dispatchAll([
      Search.setSpanArgs(["now - 5m", "now"]),
      tab.computeSpan(now)
    ])
    let from = brim
      .time(now)
      .subtract(5, "minutes")
      .toTs()
    let to = brim.time(now).toTs()

    expect(tab.getSpan(state)).toEqual([from, to])
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
      space: "",
      span: [new Date(0), new Date(1000)],
      tableProgram: "* | head 500",
      type: "events"
    })
  })
})
