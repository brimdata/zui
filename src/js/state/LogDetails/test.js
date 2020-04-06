/* @flow */

import LogDetails from "./"
import initTestStore from "../../test/initTestStore"

const record = [
  {name: "_td", type: "integer", value: "1"},
  {name: "letter", type: "string", value: "a"}
]

const record2 = [
  {name: "_td", type: "integer", value: "1"},
  {name: "letter", type: "string", value: "b"}
]

let store
beforeEach(() => {
  store = initTestStore()
})

test("viewing a log detail", () => {
  let state = store.dispatchAll([LogDetails.push(record)])
  const log = LogDetails.build(state)

  expect(log && log.getString("letter")).toEqual("a")
})

test("viewing 2 logs", () => {
  let state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2)
  ])

  const log = LogDetails.build(state)
  expect(log && log.getString("letter")).toBe("b")
})

test("going back to the first log", () => {
  let state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
    LogDetails.back()
  ])

  const log = LogDetails.build(state)
  expect(log && log.getString("letter")).toBe("a")
})

test("going back and then forward", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.push(record2),
    LogDetails.back(),
    LogDetails.forward()
  ])

  const log = LogDetails.build(state)
  expect(log && log.getString("letter")).toBe("b")
})

test("updating the current log detail", () => {
  const state = store.dispatchAll([
    LogDetails.push(record),
    LogDetails.update({uidLogs: [record, record2]})
  ])

  expect(LogDetails.getUidLogs(state)).toEqual([record, record2])
  const log = LogDetails.build(state)
  expect(log && log.getString("letter")).toBe("a")

  store.dispatch(LogDetails.update({uidStatus: "FETCHING"}))

  expect(LogDetails.getUidStatus(store.getState())).toBe("FETCHING")
})
