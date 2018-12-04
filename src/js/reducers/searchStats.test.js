/* @flow */

import {getSearchStats} from "./searchStats"
import * as a from "../actions/searchStats"
import initStore from "../test/initStore"

test("setting search stats", () => {
  const stats = {
    startTime: 1536886114918,
    updateTime: 1536886114598,
    bytesMatched: 105478381,
    bytesRead: 105539067,
    tuplesMatched: 548741,
    tuplesRead: 548741
  }
  const store = initStore()
  store.dispatch(a.setSearchStats(stats))
  const state = store.getState()

  expect(getSearchStats(state)).toEqual(stats)
})
