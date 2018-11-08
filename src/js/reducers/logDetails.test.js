import * as r from "./logDetails"
import * as a from "../actions/logDetails"

const tuple = ["1", "a"]
const descriptor = [
  {name: "_td", type: "integer"},
  {name: "letter", type: "string"}
]
const reduce = actions => ({
  logDetails: actions.reduce(r.default, r.initialState)
})

test("viewing a log detail", () => {
  let state = reduce([a.pushLogDetail({tuple, descriptor})])
  const log = r.buildLogDetail(state)

  expect(log.get("letter")).toEqual("a")
})

test("viewing 2 logs", () => {
  const tuple2 = ["1", "b"]
  let state = reduce([
    a.pushLogDetail({tuple, descriptor}),
    a.pushLogDetail({tuple: tuple2, descriptor})
  ])

  const log = r.buildLogDetail(state)
  expect(log.get("letter")).toBe("b")
})

test("going back to the first log", () => {
  const tuple2 = ["1", "b"]
  let state = reduce([
    a.pushLogDetail({tuple, descriptor}),
    a.pushLogDetail({tuple: tuple2, descriptor}),
    a.backLogDetail()
  ])

  const log = r.buildLogDetail(state)
  expect(log.get("letter")).toBe("a")
})

test("going back and then forward", () => {
  const tuple2 = ["1", "b"]
  const state = reduce([
    a.pushLogDetail({tuple, descriptor}),
    a.pushLogDetail({tuple: tuple2, descriptor}),
    a.backLogDetail(),
    a.forwardLogDetail()
  ])

  const log = r.buildLogDetail(state)
  expect(log.get("letter")).toBe("b")
})
