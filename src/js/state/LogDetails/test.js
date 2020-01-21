/* @flow */

import LogDetails from "./"
import initTestStore from "../../test/initTestStore"

const tuple = ["1", "a"]
const descriptor = [
  {name: "_td", type: "integer"},
  {name: "letter", type: "string"}
]

let store
beforeEach(() => {
  store = initTestStore()
})

test("viewing a log detail", () => {
  let state = store.dispatchAll([LogDetails.pushLogDetail({tuple, descriptor})])
  const log = LogDetails.buildLogDetail(state)

  expect(log && log.get("letter")).toEqual("a")
})

test("viewing 2 logs", () => {
  const tuple2 = ["1", "b"]
  let state = store.dispatchAll([
    LogDetails.pushLogDetail({tuple, descriptor}),
    LogDetails.pushLogDetail({tuple: tuple2, descriptor})
  ])

  const log = LogDetails.buildLogDetail(state)
  expect(log && log.get("letter")).toBe("b")
})

test("going back to the first log", () => {
  const tuple2 = ["1", "b"]
  let state = store.dispatchAll([
    LogDetails.pushLogDetail({tuple, descriptor}),
    LogDetails.pushLogDetail({tuple: tuple2, descriptor}),
    LogDetails.backLogDetail()
  ])

  const log = LogDetails.buildLogDetail(state)
  expect(log && log.get("letter")).toBe("a")
})

test("going back and then forward", () => {
  const tuple2 = ["1", "b"]
  const state = store.dispatchAll([
    LogDetails.pushLogDetail({tuple, descriptor}),
    LogDetails.pushLogDetail({tuple: tuple2, descriptor}),
    LogDetails.backLogDetail(),
    LogDetails.forwardLogDetail()
  ])

  const log = LogDetails.buildLogDetail(state)
  expect(log && log.get("letter")).toBe("b")
})
