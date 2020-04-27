/* @flow */
import fsExtra from "fs-extra"

import Notice from "../state/Notice"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import ingestFiles from "./ingestFiles"
import initTestStore from "../test/initTestStore"
import itestFile from "../test/itestFile"

let mockClient = {
  spaces: {
    create: () => Promise.resolve({name: "dataSpace"}),
    list: () => Promise.resolve(["dataSpace"]),
    delete: () => Promise.resolve(),
    get: () =>
      Promise.resolve({
        name: "dataSpace",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        packet_support: true
      })
  },
  logs: {post: function*() {}},
  pcaps: {
    post: function*() {
      yield {type: "TaskStart"}
      yield {
        type: "PacketPostStatus",
        snapshot_count: 1,
        start_time: {sec: 0, ns: 0},
        update_time: {sec: 1, ns: 1},
        packet_total_size: 100,
        packet_read_size: 1
      }
      yield {type: "TaskEnd"}
    }
  }
}

test("opening a packet", async () => {
  let store = initTestStore()
  let globalDispatch = store.dispatch
  await store.dispatch(
    ingestFiles([itestFile("sample.pcap")], mockClient, globalDispatch)
  )

  let state = store.getState()
  expect(Tab.spaceName(state)).toEqual("dataSpace")
  expect(Tab.space(state)).toEqual({
    name: "dataSpace",
    min_time: {ns: 0, sec: 0},
    max_time: {ns: 1, sec: 1},
    packet_support: true,
    ingest: {
      progress: null,
      warnings: []
    }
  })

  return fsExtra.remove("tmp")
})

test("when there is an error", async () => {
  let store = initTestStore()
  let globalDispatch = store.dispatch
  mockClient.pcaps.post = function*() {
    yield {type: "TaskEnd", error: {error: "Boom"}}
  }

  await store.dispatch(
    ingestFiles([itestFile("sample.pcap")], mockClient, globalDispatch)
  )

  let state = store.getState()
  let cluster = Tab.clusterId(state)
  expect(Spaces.getSpaces(cluster)(state)).toEqual([])
  expect(Tab.spaceName(state)).toEqual("")
  expect(Notice.getError(state)).toEqual({
    details: ["Detail: Boom"],
    message: "Unable to generate full summary logs from PCAP",
    type: "PCAPIngestError"
  })
  return fsExtra.remove("tmp")
})

test("a zeek ingest error", async () => {
  let store = initTestStore()
  let globalDispatch = store.dispatch
  mockClient.logs.post = function*() {
    yield {type: "TaskEnd", error: {error: "Boom"}}
  }

  await store.dispatch(
    ingestFiles([itestFile("sample.tsv")], mockClient, globalDispatch)
  )

  let state = store.getState()
  expect(Tab.spaceName(state)).toEqual("")
  expect(Notice.getError(state)).toEqual({
    details: ["Detail: Boom"],
    message: "Unable to load these logs",
    type: "LogsIngestError"
  })
  return fsExtra.remove("tmp")
})
