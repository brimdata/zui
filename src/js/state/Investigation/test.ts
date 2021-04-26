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

const testWorkspaceId = "workspace1"
const testPoolId = "defaultId"

function get() {
  return Investigation.getInvestigation(
    testWorkspaceId,
    testPoolId
  )(store.getState())
}

const search1: SearchRecord = {
  program: "search1",
  pins: [],
  spanArgs: brim.dateTuple([new Date(0), new Date(5)]).toSpan(),
  poolId: "defaultId",
  poolName: "defaultName",
  target: "events"
}

const search2: SearchRecord = {
  program: "search2",
  pins: [],
  spanArgs: brim.dateTuple([new Date(0), new Date(5)]).toSpan(),
  poolId: "defaultId",
  poolName: "defaultName",
  target: "events"
}

test("when a new search is recorded", () => {
  expect(get()).toHaveLength(0)
  store.dispatch(Investigation.push(testWorkspaceId, testPoolId, search1))
  expect(get()).toHaveLength(1)
})

test("when a search is many times twice", () => {
  expect(get()).toHaveLength(0)

  dispatch(Investigation.push(testWorkspaceId, testPoolId, search1))
  dispatch(Investigation.push(testWorkspaceId, testPoolId, search1))
  dispatch(Investigation.push(testWorkspaceId, testPoolId, search1))

  expect(get()).toHaveLength(1)
})

test("when a search is different", () => {
  expect(get()).toHaveLength(0)

  dispatch(Investigation.push(testWorkspaceId, testPoolId, search1))
  dispatch(Investigation.push(testWorkspaceId, testPoolId, search2))

  expect(get()).toHaveLength(2)

  expect(
    select(Investigation.getCurrentFinding(testWorkspaceId, testPoolId))
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
      testWorkspaceId,
      testPoolId,
      search1,
      brim.time(new Date(0)).toTs()
    )
  )
  dispatch(
    Investigation.push(
      testWorkspaceId,
      testPoolId,
      search2,
      brim.time(new Date(1)).toTs()
    )
  )
  const {ts} = select(Investigation.getCurrentFinding)
  dispatch(Investigation.deleteFindingByTs(testWorkspaceId, testPoolId, ts))
  expect(get()[0]).toEqual({
    ts: {
      ns: expect.any(Number),
      sec: expect.any(Number)
    },
    search: search1
  })
})

test("removing several records with multiple ts", () => {
  dispatch(Investigation.push(testWorkspaceId, testPoolId, search1))
  dispatch(Investigation.push(testWorkspaceId, testPoolId, search2))

  const multiTs = get().map((finding) => finding.ts)
  dispatch(
    Investigation.deleteFindingByTs(testWorkspaceId, testPoolId, multiTs)
  )

  expect(get().length).toBe(0)
})
