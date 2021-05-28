import Pools from "./"
import initTestStore from "../../../../test/unit/helpers/initTestStore"
import {Pool} from "./types"

let store
beforeEach(() => {
  store = initTestStore()
})

const detail = {
  id: "defaultId",
  name: "defaultName",
  span: {
    ts: {sec: 1425564900, ns: 0},
    dur: {sec: 3352893, ns: 750000000}
  }
}

const testPool1: Pool = {
  id: "testId1",
  name: "testName1",
  max_time: {ns: 0, sec: 0},
  min_time: {ns: 0, sec: 0},
  size: 99,
  ingest: {
    progress: null,
    warnings: []
  }
}

const testPool2: Pool = {
  id: "testId2",
  name: "testName2",
  max_time: {ns: 0, sec: 0},
  min_time: {ns: 0, sec: 0},
  size: 99,
  ingest: {
    progress: null,
    warnings: []
  }
}

const testPools: Pool[] = [testPool1, testPool2]

test("setting the pools merges with previous data", () => {
  const state = store.dispatchAll([
    Pools.setDetail("workspace1", testPool1),
    Pools.setPools("workspace1", [{id: "testId1", name: "testName1"}])
  ])

  expect(Pools.get("workspace1", "testId1")(state)).toEqual(testPool1)
})

test("pool names removing", () => {
  const selector = Pools.ids("workspace1")
  const state = store.dispatchAll([
    Pools.setPools("workspace1", testPools),
    Pools.setPools("workspace1", [testPool2])
  ])

  expect(selector(state)).toEqual(["testId2"])
})

test("setting the pool detail adds the defaults", () => {
  const state = store.dispatchAll([Pools.setDetail("workspace1", detail)])

  expect(Pools.get("workspace1", "defaultId")(state)).toEqual({
    name: "defaultName",
    id: "defaultId",
    min_time: {sec: 1425564900, ns: 0},
    max_time: {sec: 1428917793, ns: 750000000},
    ingest: {
      progress: null,
      warnings: []
    }
  })
})

test("setting the ingest progress throws error if no pool yet", () => {
  expect(() => {
    store.dispatchAll([Pools.setIngestProgress("workspace1", detail.id, 0.5)])
  }).toThrow("No pool exists with id: defaultId")
})

test("setting the ingest progress", () => {
  const actions = Pools.actionsFor("workspace1", testPool1.id)
  store.dispatchAll([
    Pools.setPools("workspace1", testPools),
    actions.setIngestProgress(0.5)
  ])

  const value = Pools.getIngestProgress(
    "workspace1",
    testPool1.id
  )(store.getState())

  expect(value).toEqual(0.5)
})

test("getting the pools with details, others not", () => {
  const state = store.dispatchAll([
    Pools.setPools("workspace1", testPools),
    Pools.setDetail("workspace1", {...detail})
  ])
  const pools = Pools.getPools("workspace1")(state)

  expect(pools).toEqual([
    {...testPool1, ingest: {warnings: [], progress: null}},
    {...testPool2, ingest: {warnings: [], progress: null}},
    {
      name: "defaultName",
      id: "defaultId",
      max_time: {ns: 750000000, sec: 1428917793},
      min_time: {ns: 0, sec: 1425564900},
      ingest: {warnings: [], progress: null}
    }
  ])
})

test("only cares about pools actions", () => {
  store.dispatch({type: "NON_SPACE"})
  expect(Pools.raw(store.getState())).toEqual({})
})

test("ingest warnings", () => {
  const actions = Pools.actionsFor("workspace1", testPool1.id)
  const state = store.dispatchAll([
    Pools.setPools("workspace1", [testPool1]),
    actions.appendIngestWarning("Problem 1"),
    actions.appendIngestWarning("Problem 2")
  ])

  expect(Pools.getIngestWarnings("workspace1", testPool1.id)(state)).toEqual([
    "Problem 1",
    "Problem 2"
  ])
})

test("clear warnings", () => {
  const actions = Pools.actionsFor("workspace1", testPool1.id)
  const state = store.dispatchAll([
    Pools.setPools("workspace1", [testPool1]),
    actions.appendIngestWarning("Problem 1"),
    actions.appendIngestWarning("Problem 2"),
    actions.clearIngestWarnings()
  ])

  expect(Pools.getIngestWarnings("workspace1", testPool1.id)(state)).toEqual([])
})

test("remove pool", () => {
  const actions = Pools.actionsFor("workspace1", testPool1.id)

  const state = store.dispatchAll([
    Pools.setPools("workspace1", [testPool1]),
    actions.remove()
  ])

  expect(Pools.getPools("workspace1")(state)).toEqual([])
})

test("rename a pool", () => {
  const testRename = "renamed test pool"

  const state = store.dispatchAll([
    Pools.setPools("workspace1", [testPool1]),
    Pools.rename("workspace1", testPool1.id, testRename)
  ])

  expect(Pools.get("workspace1", testPool1.id)(state).name).toEqual(testRename)
})
