import reducer, {initialState, buildLogDetail} from "./logDetails"
import {
  viewLogDetail,
  backLogDetail,
  forwardLogDetail
} from "../actions/logDetails"

const tuple = ["1", "a"]
const descriptor = [
  {name: "_td", type: "integer"},
  {name: "letter", type: "string"}
]
const root = state => ({
  logDetails: state
})

test("viewing a log detail", () => {
  let state = reducer(initialState, viewLogDetail({tuple, descriptor}))
  const log = buildLogDetail(root(state))

  expect(log.get("letter")).toEqual("a")
})

test("viewing 2 logs", () => {
  const tuple2 = ["1", "b"]
  let state = reducer(initialState, viewLogDetail({tuple, descriptor}))
  state = reducer(state, viewLogDetail({tuple: tuple2, descriptor}))

  const log = buildLogDetail(root(state))
  expect(log.get("letter")).toBe("b")
})

test("going back to the first log", () => {
  const tuple2 = ["1", "b"]
  let state = initialState
  state = reducer(state, viewLogDetail({tuple, descriptor}))
  state = reducer(state, viewLogDetail({tuple: tuple2, descriptor}))
  state = reducer(state, backLogDetail())

  const log = buildLogDetail(root(state))
  expect(log.get("letter")).toBe("a")
})

test("going back and then forward", () => {
  const tuple2 = ["1", "b"]
  let state = initialState
  state = reducer(state, viewLogDetail({tuple, descriptor}))
  state = reducer(state, viewLogDetail({tuple: tuple2, descriptor}))
  state = reducer(state, backLogDetail())
  state = reducer(state, forwardLogDetail())

  const log = buildLogDetail(root(state))
  expect(log.get("letter")).toBe("b")
})
