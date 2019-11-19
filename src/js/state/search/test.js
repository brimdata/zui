/* @flow */

import brim from "../../brim"
import initTestStore from "../../test/initTestStore"
import search from "./"

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
    let state = store.dispatchAll([search.setSpan([ts1, ts2])])
    expect(search.getSpan(state)).toEqual([ts1, ts2])
  })

  test("set span focus", () => {
    let state = store.dispatchAll([search.setSpanFocus([ts3, ts4])])
    expect(search.getSpanFocus(state)).toEqual([ts3, ts4])
  })

  test("set span focus to null", () => {
    let state = store.dispatchAll([search.setSpanFocus(null)])
    expect(search.getSpanFocus(state)).toEqual(null)
  })

  test("set span args", () => {
    let state = store.dispatchAll([
      search.setSpanArgs([{time: ts1}, {relTime: "now"}])
    ])
    expect(search.getSpanArgs(state)).toEqual([{time: ts1}, {relTime: "now"}])
  })

  test("compute span", () => {
    let now = new Date(2000, 3, 12, 12, 30)
    let state = store.dispatchAll([
      search.setSpanArgs([{relTime: "now - 5m"}, {relTime: "now"}]),
      search.computeSpan(now)
    ])
    let from = brim
      .time(now)
      .subtract(5, "minutes")
      .toTs()
    let to = brim.time(now).toTs()

    expect(search.getSpan(state)).toEqual([from, to])
  })
})
