/* @flow */

import initTestStore from "../test/initTestStore"
import {getSpaces, getAllSpaceNames, getCurrentSpaceName} from "./spaces"
import * as a from "../state/actions/spaces"

let store
beforeEach(() => {
  store = initTestStore()
})

const spaceInfo = {
  name: "ranch-logs",
  flush_timeout: 500,
  close_timeout: 5000,
  slab_threshold: 131072,
  slab_fanout: 8,
  max_writers: 150,
  min_time: {
    sec: 1425564900,
    ns: 0
  },
  max_time: {
    sec: 1428917793,
    ns: 750000000
  },
  size: 199913776
}

test("setting space information", () => {
  const state = store.dispatchAll([a.setSpaceInfo(spaceInfo)])

  expect(getSpaces(state)).toEqual({
    "ranch-logs": {
      name: "ranch-logs",
      flush_timeout: 500,
      close_timeout: 5000,
      slab_threshold: 131072,
      slab_fanout: 8,
      max_writers: 150,
      minTime: new Date(Date.UTC(2015, 2, 5, 14, 15, 0, 0)),
      maxTime: new Date(Date.UTC(2015, 3, 13, 9, 36, 33, 750)),
      min_time: {
        sec: 1425564900,
        ns: 0
      },
      max_time: {
        sec: 1428917793,
        ns: 750000000
      },
      size: 199913776
    }
  })
})

test("setting space names", () => {
  store.dispatch(a.setSpaceNames(["a", "b", "c"]))
  expect(getAllSpaceNames(store.getState())).toEqual(["a", "b", "c"])
})

test("clearing spaces", () => {
  const state = store.dispatchAll([
    a.setSpaceNames(["a", "b", "c"]),
    a.setSpaceInfo(spaceInfo),
    a.clearSpaces()
  ])

  expect(getAllSpaceNames(state)).toEqual([])
  expect(getSpaces(state)).toEqual({})
})

test("set the current space name", () => {
  store.dispatch(a.setCurrentSpaceName("facebook"))

  expect(getCurrentSpaceName(store.getState())).toEqual("facebook")
})

test("clear the current space name", () => {
  const state = store.dispatchAll([
    store.dispatch(a.setCurrentSpaceName("facebook")),
    store.dispatch(a.clearSpaces())
  ])

  expect(getCurrentSpaceName(state)).toEqual(null)
})
