/* @flow */
import path from "path"

import ingestFiles from "./ingestFiles"
import initTestStore from "../test/initTestStore"

const testFile = (name) => path.join(__dirname, "../../../itest/", name)
const pcap = testFile("sample.pcap")
// const zeek = testFile("sample.zeek.log")
// const json = testFile("sample.json.zeek.log")
// const unknown = testFile("setup.js")

let store
let client = {
  spaces: {
    create: () => Promise.resolve({name: "darkhorse"}),
    delete: () => Promise.resolve(),
    get: () => Promise.resolve({})
  },
  pcaps: {
    post: function*() {
      yield {type: "PacketPostStatus"}
      yield {type: "TaskEnd"}
    }
  }
}

beforeEach(() => {
  store = initTestStore()
})

test("run code", () => {
  let paths = [pcap]
  return store.dispatch(ingestFiles(paths, client))
})
