/* @flow */

import {createZealotMock} from "zealot"

import Clusters from "../state/Clusters"
import Search from "../state/Search"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import createSubspace from "./createSubspace"
import fixtures from "../test/fixtures"
import initTestStore from "../test/initTestStore"

let store, zealot
const select = (selector) => selector(store.getState())
const conn = fixtures("cluster1")
const space = fixtures("space1")
const subspace = {...space, id: "2", parent_id: 1, name: "subspace"}
const records = [
  [
    {name: "key", type: "string", value: "10.10.10.10"},
    {name: "_log", type: "string", value: "/log.zng"}
  ],
  [
    {name: "key", type: "string", value: "10.10.10.10"},
    {name: "_log", type: "string", value: "/log-2.zng"}
  ]
]

beforeEach(() => {
  zealot = createZealotMock()
    .stubPromise("subspaces.create", subspace)
    .stubPromise("spaces.list", [space, subspace])
  store = initTestStore(zealot)
  store.dispatchAll([
    Clusters.add(conn),
    Spaces.setDetail(conn.id, space),
    Search.setCluster(conn.id),
    Search.setSpace(space.id),
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
  expect(select(Tab.getSpaceId)).toBe("2")
})

test("The subspace is named the first key of the records", async () => {
  await store.dispatch(createSubspace())
  expect(zealot.calls("subspaces.create")[0].args.name).toEqual("10.10.10.10")
})

test("Sends the array of selected logs", async () => {
  store.dispatch(Viewer.selectRange(1))
  await store.dispatch(createSubspace())
  expect(zealot.calls("subspaces.create")[0].args.logs).toEqual([
    "/log.zng",
    "/log-2.zng"
  ])
})

test("The list of spaces is updated", async () => {
  // $FlowFixMe
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
      [{name: "fun", type: "string", value: "time"}]
    ]),
    Viewer.select(0)
  ])

  return expect(store.dispatch(createSubspace())).rejects.toThrow(
    "Missing field: _log"
  )
})

test("Error if there is no key fields", () => {
  store.dispatchAll([
    Viewer.clear(),
    Viewer.appendRecords(undefined, [
      [{name: "_log", type: "string", value: "time"}]
    ]),
    Viewer.select(0)
  ])

  return expect(store.dispatch(createSubspace())).rejects.toThrow(
    "Missing field: key"
  )
})
