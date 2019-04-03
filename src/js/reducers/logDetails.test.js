/* @flow */
import {
  backLogDetail,
  forwardLogDetail,
  pushLogDetail
} from "../actions/logDetails"
import {buildLogDetail} from "../selectors/logDetails"
import initStore from "../test/initStore"

const tuple = ["1", "a"]
const descriptor = [
  {name: "_td", type: "integer"},
  {name: "letter", type: "string"}
]

let store
beforeEach(() => {
  store = initStore()
})

test("viewing a log detail", () => {
  let state = store.dispatchAll([pushLogDetail({tuple, descriptor})])
  const log = buildLogDetail(state)

  expect(log && log.get("letter")).toEqual("a")
})

test("viewing 2 logs", () => {
  const tuple2 = ["1", "b"]
  let state = store.dispatchAll([
    pushLogDetail({tuple, descriptor}),
    pushLogDetail({tuple: tuple2, descriptor})
  ])

  const log = buildLogDetail(state)
  expect(log && log.get("letter")).toBe("b")
})

test("going back to the first log", () => {
  const tuple2 = ["1", "b"]
  let state = store.dispatchAll([
    pushLogDetail({tuple, descriptor}),
    pushLogDetail({tuple: tuple2, descriptor}),
    backLogDetail()
  ])

  const log = buildLogDetail(state)
  expect(log && log.get("letter")).toBe("a")
})

test("going back and then forward", () => {
  const tuple2 = ["1", "b"]
  const state = store.dispatchAll([
    pushLogDetail({tuple, descriptor}),
    pushLogDetail({tuple: tuple2, descriptor}),
    backLogDetail(),
    forwardLogDetail()
  ])

  const log = buildLogDetail(state)
  expect(log && log.get("letter")).toBe("b")
})
