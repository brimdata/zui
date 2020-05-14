/* @flow */
import fsExtra from "fs-extra"

import Prefs from "../state/Prefs"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import ingestFiles from "./ingestFiles"
import initTestStore from "../test/initTestStore"
import itestFile from "../test/itestFile"
import lib from "../lib"

let mockClient = {
  spaces: {
    delete: () => Promise.resolve(),
    create: () => Promise.resolve({name: "sample.pcap.brim", id: "spaceId"}),
    get: () =>
      Promise.resolve({
        name: "sample.pcap.brim",
        id: "spaceId",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        pcap_support: true
      })
  },
  logs: {post: function*() {}},
  pcaps: {
    post: function*() {
      yield {type: "TaskStart"}
      yield {
        type: "PcapPostStatus",
        snapshot_count: 1,
        start_time: {sec: 0, ns: 0},
        update_time: {sec: 1, ns: 1},
        pcap_total_size: 100,
        pcap_read_size: 1
      }
      yield {type: "TaskEnd"}
    }
  }
}

afterEach(() => {
  return fsExtra.remove("tmp")
})

test("opening a pcap", async () => {
  let store = initTestStore()
  let globalDispatch = store.dispatch
  await store.dispatch(
    ingestFiles([itestFile("sample.pcap")], mockClient, globalDispatch)
  )

  let state = store.getState()
  expect(Tab.getSpaceName(state)).toEqual("sample.pcap.brim")
  expect(Tab.space(state)).toEqual({
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
})

test("register a handler with a space id", async () => {
  let store = initTestStore()
  let globalDispatch = store.dispatch
  await store.dispatch(
    ingestFiles([itestFile("sample.pcap")], mockClient, globalDispatch)
  )

  let handler = store.getActions().find((a) => a.type === "HANDLERS_REGISTER")

  expect(handler).toEqual({
    type: "HANDLERS_REGISTER",
    handler: {type: "INGEST", spaceId: "spaceId"},
    id: expect.any(String)
  })
})

test("when there is an error", async () => {
  let store = initTestStore()
  let globalDispatch = store.dispatch
  mockClient.pcaps.post = function*() {
    yield {type: "TaskEnd", error: {error: "Boom"}}
  }
  await expect(
    store.dispatch(
      ingestFiles([itestFile("sample.pcap")], mockClient, globalDispatch)
    )
  ).rejects.toEqual(expect.any(Error))

  let state = store.getState()
  let cluster = Tab.clusterId(state)
  expect(Spaces.getSpaces(cluster)(state)).toEqual([])
  expect(Tab.getSpaceName(state)).toEqual("")
})

test("a zeek ingest error", async () => {
  let store = initTestStore()
  let globalDispatch = store.dispatch
  mockClient.logs.post = function*() {
    yield {type: "TaskEnd", error: {error: "Boom"}}
  }

  await expect(
    store.dispatch(
      ingestFiles([itestFile("sample.tsv")], mockClient, globalDispatch)
    )
  ).rejects.toEqual(expect.any(Error))

  let state = store.getState()
  expect(Tab.getSpaceName(state)).toEqual("")
})

test("a json file with a custom types config", async () => {
  let store = initTestStore()
  let globalDispatch = store.dispatch
  mockClient.logs.post = jest.fn(function*() {
    yield {type: "LogPostStatus"}
    yield {type: "TaskEnd"}
  })

  let contents = await lib.file(itestFile("sampleTypes.json")).read()
  store.dispatch(Prefs.setJSONTypeConfig(itestFile("sampleTypes.json")))

  await store.dispatch(
    ingestFiles([itestFile("sample.ndjson")], mockClient, globalDispatch)
  )

  expect(mockClient.logs.post).toHaveBeenCalledWith({
    paths: [itestFile("sample.ndjson")],
    spaceId: "spaceId",
    types: contents
  })
})
