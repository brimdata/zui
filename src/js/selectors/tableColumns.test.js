import {TableColumns} from "../models/TableColumns"
import {conn, dns} from "../test/mockLogs"
import {
  getCurrentTableKey,
  getCurrentUniqColumns,
  getTableColumns
} from "./tableColumns"
import {mainSearchEvents} from "../actions/mainSearch"
import {receiveDescriptor} from "../actions/descriptors"
import {setCurrentSpaceName} from "../actions/spaces"
import initStore from "../test/initStore"

const connLog = conn()
const dnsLog = dns()
let store

beforeEach(() => {
  store = initStore()
})

describe("#getCurrentTableKey", () => {
  test("logs with one td", () => {
    const state = store.dispatchAll([
      setCurrentSpaceName("default"),
      receiveDescriptor("default", connLog.tuple[0], connLog.descriptor),
      mainSearchEvents([connLog.tuple])
    ])

    expect(getCurrentTableKey(state)).toBe(connLog.tuple[0])
  })

  test("logs with multiple tds", () => {
    const state = store.dispatchAll([
      setCurrentSpaceName("default"),
      receiveDescriptor("default", connLog.tuple[0], connLog.descriptor),
      receiveDescriptor("default", dnsLog.tuple[0], dnsLog.descriptor),
      mainSearchEvents([connLog.tuple, dnsLog.tuple])
    ])

    expect(getCurrentTableKey(state)).toBe("temp")
  })

  test("no logs", () => {
    const state = store.getState()

    expect(getCurrentTableKey(state)).toBe("none")
  })
})

describe("#getCurrentUniqColumns", () => {
  test("contains no duplicate columns", () => {
    const a = {name: "a", type: "string"}
    const b = {name: "b", type: "string"}
    const b2 = {name: "b2", type: "integer"}
    const c = {name: "c", type: "time"}
    const state = store.dispatchAll([
      setCurrentSpaceName("default"),
      receiveDescriptor("default", "1", [a, b, b2]),
      receiveDescriptor("default", "2", [a, b, c]),
      mainSearchEvents([["1"], ["2"]])
    ])

    expect(getCurrentUniqColumns(state)).toEqual([a, b, b2, c])
  })
})

describe("#getTableColumns", () => {
  test("returns the class", () => {
    const state = store.getState()
    expect(getTableColumns(state)).toBeInstanceOf(TableColumns)
  })

  test("merges columns and columnSettings", () => {
    const state = store.dispatchAll([
      setCurrentSpaceName("default"),
      receiveDescriptor("default", connLog.tuple[0], connLog.descriptor),
      receiveDescriptor("default", dnsLog.tuple[0], dnsLog.descriptor),
      mainSearchEvents([connLog.tuple, dnsLog.tuple])
    ])

    const tableColumns = getTableColumns(state)
    expect(tableColumns.toArray()).toHaveLength(40)
  })
})
