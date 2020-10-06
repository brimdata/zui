import {createZealotMock, zjson, zng} from "zealot"

import Clusters from "../state/Clusters"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import createSubspace from "./createSubspace"
import fixtures from "../test/fixtures"
import initTestStore from "../test/initTestStore"

let store, mock
const select = (selector) => selector(store.getState())
const conn = fixtures("cluster1")
const space = fixtures("space1")
const subspace = {...space, id: "2", parent_id: 1, name: "subspace"}
const cols = [
  {name: "key", type: "string"},
  {name: "_log", type: "string"}
] as zjson.Column[]
const records = [
  new zng.Record(cols, ["10.10.10.10", "/log.zng"]),
  new zng.Record(cols, ["10.10.10.10", "/log-2.zng"])
]

beforeEach(() => {
  mock = createZealotMock()
    .stubPromise("subspaces.create", subspace)
    .stubPromise("spaces.list", [space, subspace])
  store = initTestStore(mock.zealot)
  store.dispatchAll([
    Clusters.add(conn),
    Spaces.setDetail(conn.id, space),
    Current.setConnectionId(conn.id),
    Current.setSpaceId(space.id),
    Viewer.appendRecords(undefined, records),
    Viewer.select(0)
  ])
})

test("Makes a new tab", async () => {
  expect(select(Tabs.getCount)).toBe(1)
  await store.dispatch(createSubspace())
  expect(select(Tabs.getCount)).toBe(2)
})

test("The new tab is active", async () => {
  const before = select(Tabs.getActive)
  await store.dispatch(createSubspace())
  expect(select(Tabs.getActive)).not.toBe(before)
})

test("The subspace is the current space", async () => {
  await store.dispatch(createSubspace())
  expect(select(Current.getSpaceId)).toBe("2")
})

test("The subspace is named the first key of the records", async () => {
  await store.dispatch(createSubspace())
  expect(mock.calls("subspaces.create")[0].args.name).toEqual("10.10.10.10")
})

test("Sends the array of selected logs", async () => {
  store.dispatch(Viewer.selectRange(1))
  await store.dispatch(createSubspace())
  expect(mock.calls("subspaces.create")[0].args.logs).toEqual([
    "/log.zng",
    "/log-2.zng"
  ])
})

test("The list of spaces is updated", async () => {
  const count = () => select(Spaces.getSpaces(conn.id)).length
  expect(count()).toBe(1)
  await store.dispatch(createSubspace())
  expect(count()).toBe(2)
})

test("Error if there is no selected records", () => {
  store.dispatch(Viewer.selectMulti(0))
  return expect(store.dispatch(createSubspace())).rejects.toThrow(
    "No selected logs"
  )
})

test("Error if there is no _log fields", () => {
  store.dispatchAll([
    Viewer.clear(),
    Viewer.appendRecords(undefined, [
      new zng.Record([{name: "fun", type: "string"}], ["time"])
    ]),
    Viewer.select(0)
  ])

  return expect(store.dispatch(createSubspace())).rejects.toThrow(
    '"_log" not present in ["fun"]'
  )
})

test("Error if there is no key fields", () => {
  store.dispatchAll([
    Viewer.clear(),
    Viewer.appendRecords(undefined, [
      new zng.Record([{name: "_log", type: "string"}], ["time"])
    ]),
    Viewer.select(0)
  ])

  return expect(store.dispatch(createSubspace())).rejects.toThrow(
    '"key" not present in ["_log"]'
  )
})
