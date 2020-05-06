/* @flow */
import type {SpaceDetailPayload} from "../../services/zealot/types"
import Spaces from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

let detail: SpaceDetailPayload = {
  name: "default",
  span: {
    ts: {sec: 1425564900, ns: 0},
    dur: {sec: 3352893, ns: 750000000}
  },
  pcap_support: true
}

test("setting the names", () => {
  let state = store.dispatchAll([
    Spaces.setNames("cluster1", ["default", "hq_integration"])
  ])

  expect(Spaces.names("cluster1")(state)).toEqual(["default", "hq_integration"])
})

test("space names removing", () => {
  let selector = Spaces.names("cluster1")
  let state = store.dispatchAll([
    Spaces.setNames("cluster1", ["default", "hq_integration"]),
    Spaces.setNames("cluster1", ["default"])
  ])

  expect(selector(state)).toEqual(["default"])
})

test("setting the space detail adds the defaults", () => {
  let state = store.dispatchAll([Spaces.setDetail("cluster1", detail)])

  expect(Spaces.get("cluster1", "default")(state)).toEqual({
    name: "default",
    pcap_support: true,
    min_time: {sec: 1425564900, ns: 0},
    max_time: {sec: 1428917793, ns: 750000000},
    ingest: {
      progress: null,
      warnings: [],
      snapshot: null
    }
  })
})

test("setting the ingest progress throws error if no space yet", () => {
  expect(() => {
    store.dispatchAll([Spaces.setIngestProgress("cluster1", detail.name, 0.5)])
  }).toThrow("No space exists with name: default")
})

test("setting the ingest progress", () => {
  let actions = Spaces.actionsFor("cluster1", detail.name)
  store.dispatchAll([actions.create(), actions.setIngestProgress(0.5)])

  let value = Spaces.getIngestProgress(
    "cluster1",
    detail.name
  )(store.getState())

  expect(value).toEqual(0.5)
})

test("getting the spaces with details, others not", () => {
  let state = store.dispatchAll([
    Spaces.setNames("cluster1", ["space-a", "space-b"]),
    Spaces.setDetail("cluster1", {...detail, name: "space-a"})
  ])
  let spaces = Spaces.getSpaces("cluster1")(state)

  expect(spaces).toEqual([
    {
      name: "space-a",
      max_time: {ns: 750000000, sec: 1428917793},
      min_time: {ns: 0, sec: 1425564900},
      pcap_support: true,
      ingest: {warnings: [], progress: null, snapshot: null}
    },
    {
      name: "space-b",
      max_time: {ns: 0, sec: 0},
      min_time: {ns: 0, sec: 0},
      pcap_support: false,
      ingest: {warnings: [], progress: null, snapshot: null}
    }
  ])
})

test("only cares about spaces actions", () => {
  store.dispatch({type: "NON_SPACE"})
  expect(Spaces.raw(store.getState())).toEqual({})
})

test("ingest warnings", () => {
  let actions = Spaces.actionsFor("cluster1", detail.name)
  let state = store.dispatchAll([
    actions.create(),
    actions.appendIngestWarning("Problem 1"),
    actions.appendIngestWarning("Problem 2")
  ])

  expect(Spaces.getIngestWarnings("cluster1", detail.name)(state)).toEqual([
    "Problem 1",
    "Problem 2"
  ])
})

test("clear warnings", () => {
  let actions = Spaces.actionsFor("cluster1", detail.name)
  let state = store.dispatchAll([
    actions.create(),
    actions.appendIngestWarning("Problem 1"),
    actions.appendIngestWarning("Problem 2"),
    actions.clearIngestWarnings()
  ])

  expect(Spaces.getIngestWarnings("cluster1", detail.name)(state)).toEqual([])
})

test("remove space", () => {
  let actions = Spaces.actionsFor("cluster1", detail.name)

  let state = store.dispatchAll([actions.create(), actions.remove()])

  expect(Spaces.getSpaces("cluster1")(state)).toEqual([])
})

test("setting the spanshot counter", () => {
  let actions = Spaces.actionsFor("cluster1", detail.name)

  let state = store.dispatchAll([
    actions.create(),
    actions.setIngestSnapshot(1)
  ])

  expect(Spaces.getIngestSnapshot("cluster1", detail.name)(state)).toBe(1)
})
