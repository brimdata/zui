/* @flow */
import fsExtra from "fs-extra"

import Tab from "../state/Tab"
import ingestFiles from "./ingestFiles"
import initTestStore from "../test/initTestStore"
import itestFile from "../test/itestFile"

let mockClient = {
  spaces: {
    create: () => Promise.resolve({name: "dataSpace"}),
    list: () => Promise.resolve(["dataSpace"]),
    get: () =>
      Promise.resolve({
        name: "dataSpace",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        packet_support: true
      })
  },
  pcaps: {
    post: function*() {
      yield {type: "TaskStart"}
      yield {
        type: "PacketPostStatus",
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
    ingest_progress: null
  })

  return fsExtra.remove("tmp")
})
