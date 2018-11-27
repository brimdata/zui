import reducer, {
  initialState,
  getSearchStats,
  getRawSearchStats
} from "./searchStats"
import * as a from "../actions/searchStats"

const reduce = actions =>
  JSON.parse(
    JSON.stringify({searchStats: actions.reduce(reducer, initialState)})
  )

test("setting search stats", () => {
  const stats = {
    startTime: 1536886114918,
    updateTime: 1536886114598,
    bytesMatched: 105478381,
    bytesRead: 105539067,
    tuplesMatched: 548741,
    tuplesRead: 548741
  }

  const state = reduce([a.setSearchStats(stats)])

  expect(getSearchStats(state)).toEqual(stats)
  expect(getRawSearchStats(state).startTime).toBe(1536886114918)
})
