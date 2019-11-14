/* @flow */

import {
  clearSpaces,
  setCurrentSpaceName,
  setSpaceInfo,
  setSpaceNames
} from "../actions"
import {getSpaces, getAllSpaceNames, getCurrentSpaceName} from "./spaces"
import initTestStore from "../../test/initTestStore"

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
  const state = store.dispatchAll([setSpaceInfo(spaceInfo)])

  expect(getSpaces(state)).toEqual({
    "ranch-logs": {
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
  })
})

test("setting space names", () => {
  store.dispatch(setSpaceNames(["a", "b", "c"]))
  expect(getAllSpaceNames(store.getState())).toEqual(["a", "b", "c"])
})

test("clearing spaces", () => {
  const state = store.dispatchAll([
    setSpaceNames(["a", "b", "c"]),
    setSpaceInfo(spaceInfo),
    clearSpaces()
  ])

  expect(getAllSpaceNames(state)).toEqual([])
  expect(getSpaces(state)).toEqual({})
})

test("set the current space name", () => {
  store.dispatch(setCurrentSpaceName("facebook"))

  expect(getCurrentSpaceName(store.getState())).toEqual("facebook")
})

test("clear the current space name", () => {
  const state = store.dispatchAll([
    store.dispatch(setCurrentSpaceName("facebook")),
    store.dispatch(clearSpaces())
  ])

  expect(getCurrentSpaceName(state)).toEqual(null)
})
