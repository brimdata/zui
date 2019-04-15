/* @flow */

import {Handler} from "../../BoomClient"
import HistogramSearch from "./HistogramSearch"

const resultPayload = {
  channel_id: 0,
  type: "SearchResult",
  results: {
    descriptor: [{name: "ts", type: "time"}, {name: "count", type: "count"}],
    tuples: [["9999", "1"], ["9998", "2"]]
  }
}

const endPayload = {
  channel_id: 0,
  type: "SearchEnd"
}

describe("HistogramSearch", () => {
  const program = "_path = conn"
  const spans = [new Date(0), new Date(10)]

  let search
  beforeEach(() => {
    search = new HistogramSearch(program, spans)
  })

  test("#getProgram", () => {
    expect(search.getProgram()).toEqual(
      "_path = conn | every 1sec count() by _path"
    )
  })

  test("#receiveData", () => {
    let handler = new Handler()
    let dispatch = jest.fn()
    search.receiveData(handler, dispatch)

    handler.receive(resultPayload)
    handler.receive(endPayload)

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "HISTOGRAM_CLEAR"
    })

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "HISTOGRAM_SEARCH_RESULT",
      data: resultPayload.results
    })
  })
})
