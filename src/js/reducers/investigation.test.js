/* @flow */
import {createFinding} from "../actions/investigation"
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
  let record = {
    program: "",
    pins: [],
    span: [new Date(0), new Date(5)],
    space: "default"
  }

  expect(get()).toHaveLength(0)
  store.dispatch(recordSearch(record))
  expect(get()).toHaveLength(1)
})

test("when a search is many times twice", () => {
  let record = {
    program: "",
    pins: [],
    span: [new Date(0), new Date(5)],
    space: "default"
  }

  expect(get()).toHaveLength(0)
  store.dispatchAll([
    recordSearch(record),
    recordSearch(record),
    recordSearch(record)
  ])
  expect(get()).toHaveLength(1)
})

test("when a search is different", () => {
  let record1 = {
    program: "",
    pins: [],
    span: [new Date(0), new Date(5)],
    space: "default"
  }

  let record2 = {
    program: "* | count()",
    pins: [],
    span: [new Date(0), new Date(5)],
    space: "default"
  }

  expect(get()).toHaveLength(0)
  let state = store.dispatchAll([recordSearch(record1), recordSearch(record2)])
  expect(get()).toHaveLength(2)

  expect(getCurrentFinding(state)).toEqual(
    expect.objectContaining({
      ts: expect.any(Date),
      record: record2
    })
  )
})
