/* @flow */
import {createFinding} from "../actions/investigation"
import {getCurrentFinding, getInvestigation} from "./investigation"
import {histogramPayload} from "../test/mockPayloads"
import {histogramSearchResult} from "../actions/histogram"
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
