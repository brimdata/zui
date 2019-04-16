/* @flow */

import {histogramPayload} from "../../test/mockPayloads"
import Handler from "../../BoomClient/lib/Handler"
import HistogramSearch from "./HistogramSearch"

describe("HistogramSearch", () => {
  const program = "_path = conn"
  const spans = [new Date(0), new Date(10)]
  const payload = histogramPayload()

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

    handler.receive(payload.result())
    handler.receive(payload.end())

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "HISTOGRAM_CLEAR"
    })

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "HISTOGRAM_SEARCH_RESULT",
      data: payload.result().results
    })
  })
})
