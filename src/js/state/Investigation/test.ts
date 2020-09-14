import Investigation from "./"
import brim from "../../brim"
import createGlobalStore from "../createGlobalStore"
import {SearchRecord} from "src/js/types"

let store
beforeEach(() => {
  store = createGlobalStore(undefined)
})

const dispatch = (a) => store.dispatch(a)
const select = (selector) => selector(store.getState())

const testConnId = "conn1"
const testSpaceId = "defaultId"

function get() {
  return Investigation.getInvestigation(
    testConnId,
    testSpaceId
  )(store.getState())
}

const search1: SearchRecord = {
  program: "search1",
  pins: [],
  spanArgs: brim.dateTuple([new Date(0), new Date(5)]).toSpan(),
  spaceId: "defaultId",
  spaceName: "defaultName",
  target: "events"
}

const search2: SearchRecord = {
  program: "search2",
  pins: [],
  spanArgs: brim.dateTuple([new Date(0), new Date(5)]).toSpan(),
  spaceId: "defaultId",
  spaceName: "defaultName",
  target: "events"
}

test("when a new search is recorded", () => {
  expect(get()).toHaveLength(0)
  store.dispatch(Investigation.push(testConnId, testSpaceId, search1))
  expect(get()).toHaveLength(1)
})

test("when a search is many times twice", () => {
  expect(get()).toHaveLength(0)

  dispatch(Investigation.push(testConnId, testSpaceId, search1))
  dispatch(Investigation.push(testConnId, testSpaceId, search1))
  dispatch(Investigation.push(testConnId, testSpaceId, search1))

  expect(get()).toHaveLength(1)
})

test("when a search is different", () => {
  expect(get()).toHaveLength(0)

  dispatch(Investigation.push(testConnId, testSpaceId, search1))
  dispatch(Investigation.push(testConnId, testSpaceId, search2))

  expect(get()).toHaveLength(2)

  expect(
    select(Investigation.getCurrentFinding(testConnId, testSpaceId))
  ).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number)
    },
    search: search2
  })
})

test("delete a single finding by ts", () => {
  dispatch(
    Investigation.push(
      testConnId,
      testSpaceId,
      search1,
      brim.time(new Date(0)).toTs()
    )
  )
  dispatch(
    Investigation.push(
      testConnId,
      testSpaceId,
      search2,
      brim.time(new Date(1)).toTs()
    )
  )
  const {ts} = select(Investigation.getCurrentFinding)
  dispatch(Investigation.deleteFindingByTs(testConnId, testSpaceId, ts))
  expect(get()[0]).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number)
    },
    search: search1
  })
})

test("removing several records with multiple ts", () => {
  dispatch(Investigation.push(testConnId, testSpaceId, search1))
  dispatch(Investigation.push(testConnId, testSpaceId, search2))

  const multiTs = get().map((finding) => finding.ts)
  dispatch(Investigation.deleteFindingByTs(testConnId, testSpaceId, multiTs))

  expect(get().length).toBe(0)
})
