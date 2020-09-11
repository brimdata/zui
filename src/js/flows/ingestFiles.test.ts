import {createZealotMock} from "zealot"
import fsExtra from "fs-extra"

import Clusters from "../state/Clusters"
import Current from "../state/Current"
import Prefs from "../state/Prefs"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import fixtures from "../test/fixtures"
import ingestFiles from "./ingestFiles"
import initTestStore from "../test/initTestStore"
import itestFile from "../test/itestFile"
import lib from "../lib"

let store, zealot, globalDispatch
beforeEach(() => {
  zealot = createZealotMock()
    .stubStream("pcaps.post", [
      {type: "TaskStart"},
      {
        type: "PcapPostStatus",
        snapshot_count: 1,
        start_time: {sec: 0, ns: 0},
        update_time: {sec: 1, ns: 1},
        pcap_total_size: 100,
        pcap_read_size: 1
      },
      {type: "TaskEnd"}
    ])
    .stubPromise("spaces.create", {
      name: "sample.pcap.brim",
      id: "spaceId"
    })
    .stubPromise("spaces.get", {
      name: "sample.pcap.brim",
      id: "spaceId",
      min_time: {ns: 0, sec: 0},
      max_time: {ns: 1, sec: 1},
      pcap_support: true
    })
    .stubPromise("spaces.delete", true)

  const conn = fixtures("cluster1")
  store = initTestStore(zealot)
  store.dispatchAll([Clusters.add(conn), Current.setConnectionId(conn.id)])
  globalDispatch = store.dispatch
})

afterEach(() => {
  return fsExtra.remove("tmp")
})

test("opening a pcap", async () => {
  await store.dispatch(ingestFiles([itestFile("sample.pcap")], globalDispatch))

  const state = store.getState()
  expect(Tab.getSpaceName(state)).toEqual("sample.pcap.brim")
  expect(Current.mustGetSpace(state)).toEqual(
    expect.objectContaining({
      name: "sample.pcap.brim",
      id: "spaceId",
      min_time: {ns: 0, sec: 0},
      max_time: {ns: 1, sec: 1},
      pcap_support: true,
      ingest: {
        progress: null,
        warnings: [],
        snapshot: 1
      }
    })
  )
})

test("register a handler with a space id", async () => {
  await store.dispatch(ingestFiles([itestFile("sample.pcap")], globalDispatch))

  const handler = store.getActions().find((a) => a.type === "HANDLERS_REGISTER")

  expect(handler).toEqual({
    type: "HANDLERS_REGISTER",
    handler: {type: "INGEST", spaceId: "spaceId"},
    id: expect.any(String)
  })
})

test("when there is an error", async () => {
  zealot.stubStream("pcaps.post", [{type: "TaskEnd", error: {error: "Boom"}}])

  await expect(
    store.dispatch(ingestFiles([itestFile("sample.pcap")], globalDispatch))
  ).rejects.toEqual(expect.any(Error))

  const state = store.getState()
  const cluster = Current.getConnectionId(state)
  expect(Spaces.getSpaces(cluster)(state)).toEqual([])
  expect(Spaces.getSpaces(cluster)(state)).toEqual([])
  expect(Current.getSpaceId(state)).toEqual(null)
})

test("a zeek ingest error", async () => {
  zealot.stubStream("logs.post", [{type: "TaskEnd", error: {error: "Boom"}}])

  await expect(
    store.dispatch(ingestFiles([itestFile("sample.tsv")], globalDispatch))
  ).rejects.toEqual(expect.any(Error))

  let state = store.getState()
  expect(Current.getSpaceId(state)).toEqual(null)
})

test("a json file with a custom types config", async () => {
  zealot.stubStream("logs.post", [{type: "LogPostStatus"}, {type: "TaskEnd"}])

  let contents = await lib.file(itestFile("sampleTypes.json")).read()
  store.dispatch(Prefs.setJSONTypeConfig(itestFile("sampleTypes.json")))

  await store.dispatch(
    ingestFiles([itestFile("sample.ndjson")], globalDispatch)
  )

  expect(zealot.calls("logs.post")[0].args).toEqual({
    paths: [itestFile("sample.ndjson")],
    spaceId: "spaceId",
    types: JSON.parse(contents)
  })
})
