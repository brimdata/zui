/* @flow */
import {createFinding, deleteFindingByTs} from "../actions/investigation"
import {getCurrentFinding, getInvestigation} from "./investigation"
import {histogramPayload} from "../test/mockPayloads"
import {histogramSearchResult} from "../actions/histogram"
import {recordSearch} from "../actions/searchRecord"
import initTestStore from "../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

function get() {
  return getInvestigation(store.getState())
}

let record1 = {
  program: "record1",
  pins: [],
  span: [new Date(0), new Date(5)],
  space: "default"
}

let record2 = {
  program: "record2",
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
  let payload = histogramPayload()
  let state = store.dispatchAll([
    createFinding({ts: new Date()}),
    histogramSearchResult(payload.result().results)
  ])

  expect(getCurrentFinding(state)).toEqual(
    expect.objectContaining({
      chart: {
        type: "Histogram",
        results: payload.result().results
      }
    })
  )
})

test("when a new search is recorded", () => {
  expect(get()).toHaveLength(0)
  store.dispatch(recordSearch(record1))
  expect(get()).toHaveLength(1)
})

test("when a search is many times twice", () => {
  expect(get()).toHaveLength(0)
  store.dispatchAll([
    recordSearch(record1),
    recordSearch(record1),
    recordSearch(record1)
  ])
  expect(get()).toHaveLength(1)
})

test("when a search is different", () => {
  expect(get()).toHaveLength(0)
  let state = store.dispatchAll([recordSearch(record1), recordSearch(record2)])
  expect(get()).toHaveLength(2)

  expect(getCurrentFinding(state)).toEqual({
    ts: expect.any(Date),
    record: record2
  })
})

test("delete a single finding by ts", () => {
  let state = store.dispatchAll([recordSearch(record1), recordSearch(record2)])
  let {ts} = getCurrentFinding(state)

  state = store.dispatchAll([deleteFindingByTs(ts)])

  expect(get()[0]).toEqual({ts: expect.any(Date), record: record1})
})

test("removing several records with multiple ts", () => {
  store.dispatchAll([recordSearch(record1), recordSearch(record2)])
  let multiTs = get().map((finding) => finding.ts)
  store.dispatchAll([deleteFindingByTs(multiTs)])

  expect(get().length).toBe(0)
})
