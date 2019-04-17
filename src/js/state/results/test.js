/* @flow */

import {clearResults, receiveResults} from "./actions"
import {getResults} from "./selector"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

let tupleSet = {
  descriptors: {"1": [{name: "td", type: "string"}]},
  tuples: [["1"]]
}

test("receive results", () => {
  let state = store.dispatchAll([receiveResults(tupleSet)])

  expect(getResults(state)).toEqual(tupleSet)
})

test("clear results", () => {
  let state = store.dispatchAll([receiveResults(tupleSet), clearResults()])

  expect(getResults(state)).toEqual({})
})
