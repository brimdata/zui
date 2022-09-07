import Investigation from "./"
import brim from "../../brim"
import {SearchRecord} from "src/js/types"
import {createWindowStore} from "../stores/create-window-store"
import BrimApi from "src/js/api"

let store
beforeEach(() => {
  store = createWindowStore(undefined, {api: new BrimApi()})
})

const dispatch = (a) => store.dispatch(a)
const select = (selector) => selector(store.getState())

const testLakeId = "lake1"
const testPoolId = "defaultId"

function get() {
  return (
    (Investigation.raw(store.getState())[testLakeId] || {})[testPoolId] || []
  )
}

const search1: SearchRecord = {
  program: "search1",
  pins: [],
  spanArgs: brim.dateTuple([new Date(0), new Date(5)]).toSpan(),
  poolId: "defaultId",
  poolName: "defaultName",
  target: "events",
}

const search2: SearchRecord = {
  program: "search2",
  pins: [],
  spanArgs: brim.dateTuple([new Date(0), new Date(5)]).toSpan(),
  poolId: "defaultId",
  poolName: "defaultName",
  target: "events",
}

test("when a new search is recorded", () => {
  expect(get()).toHaveLength(0)
  store.dispatch(Investigation.push(testLakeId, testPoolId, search1))
  expect(get()).toHaveLength(1)
})

test("when a search is many times twice", () => {
  expect(get()).toHaveLength(0)

  dispatch(Investigation.push(testLakeId, testPoolId, search1))
  dispatch(Investigation.push(testLakeId, testPoolId, search1))
  dispatch(Investigation.push(testLakeId, testPoolId, search1))

  expect(get()).toHaveLength(1)
})

test("when a search is different", () => {
  expect(get()).toHaveLength(0)

  dispatch(Investigation.push(testLakeId, testPoolId, search1))
  dispatch(Investigation.push(testLakeId, testPoolId, search2))

  expect(get()).toHaveLength(2)

  expect(
    select(Investigation.getCurrentFinding(testLakeId, testPoolId))
  ).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number),
    },
    search: search2,
  })
})

test("delete a single finding by ts", () => {
  dispatch(
    Investigation.push(
      testLakeId,
      testPoolId,
      search1,
      brim.time(new Date(0)).toTs()
    )
  )
  dispatch(
    Investigation.push(
      testLakeId,
      testPoolId,
      search2,
      brim.time(new Date(1)).toTs()
    )
  )
  const {ts} = select(Investigation.getCurrentFinding)
  dispatch(Investigation.deleteFindingByTs(testLakeId, testPoolId, ts))
  expect(get()[0]).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number),
    },
    search: search1,
  })
})

test("removing several records with multiple ts", () => {
  dispatch(Investigation.push(testLakeId, testPoolId, search1))
  dispatch(Investigation.push(testLakeId, testPoolId, search2))

  const multiTs = get().map((finding) => finding.ts)
  dispatch(Investigation.deleteFindingByTs(testLakeId, testPoolId, multiTs))

  expect(get().length).toBe(0)
})
