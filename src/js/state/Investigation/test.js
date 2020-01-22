/* @flow */

import History from "../History"
import Investigation from "./"
import brim from "../../brim"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

function get() {
  return Investigation.getInvestigation(store.getState())
}

let search1 = {
  program: "search1",
  pins: [],
  spanArgs: brim.dateTuple([new Date(0), new Date(5)]).toSpan(),
  space: "default"
}

let search2 = {
  program: "search2",
  pins: [],
  spanArgs: brim.dateTuple([new Date(0), new Date(5)]).toSpan(),
  space: "default"
}

test("new finding", () => {
  const finding = {ts: brim.time().toTs()}
  store.dispatch(Investigation.createFinding(finding))

  expect(get()).toEqual([
    {
      ts: {
        ns: expect.any(Number),
        sec: expect.any(Number)
      }
    }
  ])
})

test("when a new search is recorded", () => {
  expect(get()).toHaveLength(0)
  store.dispatch(History.push(search1))
  expect(get()).toHaveLength(1)
})

test("when a search is many times twice", () => {
  expect(get()).toHaveLength(0)
  store.dispatchAll([
    History.push(search1),
    History.push(search1),
    History.push(search1)
  ])
  expect(get()).toHaveLength(1)
})

test("when a search is different", () => {
  expect(get()).toHaveLength(0)
  let state = store.dispatchAll([History.push(search1), History.push(search2)])
  expect(get()).toHaveLength(2)

  expect(Investigation.getCurrentFinding(state)).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number)
    },
    search: search2
  })
})

test("delete a single finding by ts", () => {
  let state = store.dispatchAll([History.push(search1), History.push(search2)])
  let {ts} = Investigation.getCurrentFinding(state)

  state = store.dispatchAll([Investigation.deleteFindingByTs(ts)])

  expect(get()[0]).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number)
    },
    search: search1
  })
})

test("removing several records with multiple ts", () => {
  store.dispatchAll([History.push(search1), History.push(search2)])
  let multiTs = get().map((finding) => finding.ts)
  store.dispatchAll([Investigation.deleteFindingByTs(multiTs)])

  expect(get().length).toBe(0)
})
