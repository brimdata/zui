import {STRING} from "test/fixtures/zjson-types"
import {ZedRecord} from "zealot/zed/data-types"
import ZedTypeDef from "zealot/zed/type-def"
import {RecordType} from "zealot/zed/zjson"
import initTestStore from "../../test/initTestStore"
import Tabs from "../Tabs"
import Viewer from "../Viewer"

let store
let tabId
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([])
  tabId = Tabs.getActive(store.getState())
})

const type = {
  kind: "record",
  fields: [
    {
      name: "ts",
      type: {
        kind: "primitive",
        name: "time"
      }
    }
  ]
} as RecordType
const conn = new ZedRecord({type, value: ["1"]})
const dns = new ZedRecord({type, value: ["2"]})
const http = new ZedRecord({type, value: ["3"]})

test("adding logs to the viewer", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [conn, dns]),
    Viewer.appendRecords(tabId, [http])
  ])

  expect(Viewer.getLogs(state).length).toEqual(3)
})

test("clear results", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [http]),
    Viewer.clear(tabId)
  ])

  expect(Viewer.getLogs(state)).toEqual([])
})

test("splice results", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [http]),
    Viewer.appendRecords(tabId, [http]),
    Viewer.appendRecords(tabId, [http]),
    Viewer.splice(tabId, 1)
  ])

  expect(Viewer.getLogs(state).length).toEqual(1)
})

test("results complete", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "COMPLETE")])

  expect(Viewer.getEndStatus(state)).toBe("COMPLETE")
})

test("results incomplete", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "INCOMPLETE")])

  expect(Viewer.getEndStatus(state)).toBe("INCOMPLETE")
})

test("results limited", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "LIMIT")])

  expect(Viewer.getEndStatus(state)).toBe("LIMIT")
})

test("update columns with same tds", () => {
  const cols1 = {
    "9d14c2039a78d76760aae879c7fd2c82": new ZedTypeDef({
      type: {kind: "typedef", name: "hello", type: STRING}
    })
  }
  const cols2 = {
    "71f1b421963d31952e15edf7e3957a81": new ZedTypeDef({
      type: {kind: "typedef", name: "hello", type: STRING}
    })
  }
  const state = store.dispatchAll([
    Viewer.updateColumns(tabId, new Map(Object.entries(cols1))),
    Viewer.updateColumns(tabId, new Map(Object.entries(cols2)))
  ])

  expect(Viewer.getColumns(state)).toEqual(
    new Map([
      [
        "9d14c2039a78d76760aae879c7fd2c82",
        new ZedTypeDef({
          type: {kind: "typedef", name: "hello", type: STRING}
        })
      ],
      [
        "71f1b421963d31952e15edf7e3957a81",
        new ZedTypeDef({
          type: {kind: "typedef", name: "hello", type: STRING}
        })
      ]
    ])
  )
})
