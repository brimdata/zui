/* @flow */

import {
  createFinding,
  deleteFindingByTs,
  histogramSearchResult,
  recordSearch
} from "../actions"
import {getCurrentFinding, getInvestigation} from "./investigation"
import {histogramLogs} from "../../test/mockPayloads"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

function get() {
  return getInvestigation(store.getState())
}

let search1 = {
  program: "search1",
  pins: [],
  span: [new Date(0), new Date(5)],
  space: "default"
}

let search2 = {
  program: "search2",
  pins: [],
  span: [new Date(0), new Date(5)],
  space: "default"
}

test("new finding", () => {
  const finding = {ts: new Date()}
  store.dispatch(createFinding(finding))

  expect(get()).toEqual([
    {
      ts: expect.any(Date)
    }
  ])
})

test("when the histogram runs it saves as a chart", () => {
  let state = store.dispatchAll([
    createFinding({ts: new Date()}),
    histogramSearchResult(histogramLogs())
  ])

  expect(getCurrentFinding(state)).toEqual(
    expect.objectContaining({
      chart: {
        type: "Histogram",
        results: histogramLogs()
      }
    })
  )
})

test("when a new search is recorded", () => {
  expect(get()).toHaveLength(0)
  store.dispatch(recordSearch(search1))
  expect(get()).toHaveLength(1)
})

test("when a search is many times twice", () => {
  expect(get()).toHaveLength(0)
  store.dispatchAll([
    recordSearch(search1),
    recordSearch(search1),
    recordSearch(search1)
  ])
  expect(get()).toHaveLength(1)
})

test("when a search is different", () => {
  expect(get()).toHaveLength(0)
  let state = store.dispatchAll([recordSearch(search1), recordSearch(search2)])
  expect(get()).toHaveLength(2)

  expect(getCurrentFinding(state)).toEqual({
    ts: expect.any(Date),
    search: search2
  })
})

test("delete a single finding by ts", () => {
  let state = store.dispatchAll([recordSearch(search1), recordSearch(search2)])
  let {ts} = getCurrentFinding(state)

  state = store.dispatchAll([deleteFindingByTs(ts)])

  expect(get()[0]).toEqual({ts: expect.any(Date), search: search1})
})

test("removing several records with multiple ts", () => {
  store.dispatchAll([recordSearch(search1), recordSearch(search2)])
  let multiTs = get().map((finding) => finding.ts)
  store.dispatchAll([deleteFindingByTs(multiTs)])

  expect(get().length).toBe(0)
})
