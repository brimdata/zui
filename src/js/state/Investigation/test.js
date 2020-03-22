/* @flow */

import Investigation from "./"
import brim from "../../brim"
import createGlobalStore from "../createGlobalStore"

let store
beforeEach(() => {
  store = createGlobalStore()
})

const dispatch = (a) => store.dispatch(a)
const select = (selector) => selector(store.getState())

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
  store.dispatch(Investigation.push(search1))
  expect(get()).toHaveLength(1)
})

test("when a search is many times twice", () => {
  expect(get()).toHaveLength(0)

  dispatch(Investigation.push(search1))
  dispatch(Investigation.push(search1))
  dispatch(Investigation.push(search1))

  expect(get()).toHaveLength(1)
})

test("when a search is different", () => {
  expect(get()).toHaveLength(0)

  dispatch(Investigation.push(search1))
  dispatch(Investigation.push(search2))

  expect(get()).toHaveLength(2)

  expect(select(Investigation.getCurrentFinding)).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number)
    },
    search: search2
  })
})

test("delete a single finding by ts", () => {
  dispatch(Investigation.push(search1, brim.time(new Date(0)).toTs()))
  dispatch(Investigation.push(search2, brim.time(new Date(1)).toTs()))
  let {ts} = select(Investigation.getCurrentFinding)
  dispatch(Investigation.deleteFindingByTs(ts))
  expect(get()[0]).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number)
    },
    search: search1
  })
})

test("removing several records with multiple ts", () => {
  dispatch(Investigation.push(search1))
  dispatch(Investigation.push(search2))

  let multiTs = get().map((finding) => finding.ts)
  dispatch(Investigation.deleteFindingByTs(multiTs))

  expect(get().length).toBe(0)
})
