/* @flow */

import {appendViewerLogs, spliceViewer} from "../viewer/actions"
import {fetchAhead} from "./logViewer"
import {setCurrentSpaceName, setOuterTimeWindow} from "../actions"
import Handler from "../../BoomClient/lib/Handler"
import Log from "../../models/Log"
import MockBoomClient from "../../test/MockBoomClient"
import initTestStore from "../../test/initTestStore"

const tuples = [["1", "100"], ["1", "200"], ["1", "300"]]
const descriptor = [{name: "_td", type: "string"}, {name: "ts", type: "time"}]

let store, boom, handler
beforeEach(() => {
  boom = new MockBoomClient()
  handler = new Handler()
  // $FlowFixMe
  boom.search = () => handler
  store = initTestStore(boom)
  store.dispatchAll([
    setCurrentSpaceName("default"),
    setOuterTimeWindow([new Date(0), new Date(10 * 1000)]),
    appendViewerLogs(tuples.map((t) => new Log(t, descriptor)))
  ])
  store.clearActions()
})

test("#fetchAhead dispatches splice", () => {
  store.dispatch(fetchAhead())

  expect(store.getActions()).toEqual(
    expect.arrayContaining([{type: "RESULTS_SPLICE", index: 2}])
  )
})

test("#fetchAhead adds 1ms to ts of last change", () => {
  const search = jest.spyOn(boom, "search")
  store.dispatch(fetchAhead())

  const lastChangeTs = tuples[1][1]
  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      searchSpan: [new Date(0), new Date(+lastChangeTs * 1000 + 1)]
    })
  )
})

test("#fetchAhead when there is only 1 event", () => {
  const search = jest.spyOn(boom, "search")
  store.dispatch(spliceViewer(1))
  store.dispatch(fetchAhead())

  expect(search).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      searchSpan: [new Date(0), new Date(10 * 1000)]
    })
  )
})
