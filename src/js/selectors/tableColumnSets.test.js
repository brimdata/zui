/* @flow */

import {conn, dns} from "../test/mockLogs"
import {
  getCurrentTableColumns,
  getCurrentTableColumnsId,
  getCurrentUniqColumns
} from "./tableColumnSets"
import {receiveDescriptor} from "../actions/descriptors"
import {receiveLogTuples} from "../actions/logs"
import {setCurrentSpaceName} from "../actions/spaces"
import TableColumns from "../models/TableColumns"
import initStore from "../test/initStore"

const connLog = conn()
const dnsLog = dns()
let store

beforeEach(() => {
  store = initStore()
})

describe("#getCurrentTableColumnsId", () => {
  test("logs with one td", () => {
    const state = store.dispatchAll([
      setCurrentSpaceName("default"),
      receiveDescriptor("default", connLog.tuple[0], connLog.descriptor),
      receiveLogTuples([connLog.tuple])
    ])

    expect(getCurrentTableColumnsId(state)).toBe(connLog.tuple[0])
  })

  test("logs with multiple tds", () => {
    const state = store.dispatchAll([
      setCurrentSpaceName("default"),
      receiveDescriptor("default", connLog.tuple[0], connLog.descriptor),
      receiveDescriptor("default", dnsLog.tuple[0], dnsLog.descriptor),
      receiveLogTuples([connLog.tuple, dnsLog.tuple])
    ])

    expect(getCurrentTableColumnsId(state)).toBe("temp")
  })

  test("no logs", () => {
    const state = store.getState()

    expect(getCurrentTableColumnsId(state)).toBe("none")
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
      receiveLogTuples([["1"], ["2"]])
    ])

    expect(getCurrentUniqColumns(state)).toEqual([a, b, b2, c])
  })
})

describe("#getCurrentTableColumns", () => {
  test("returns the class", () => {
    const state = store.getState()
    expect(getCurrentTableColumns(state)).toBeInstanceOf(TableColumns)
  })

  test("merges columns and tableSettings", () => {
    const state = store.dispatchAll([
      setCurrentSpaceName("default"),
      receiveDescriptor("default", connLog.tuple[0], connLog.descriptor),
      receiveDescriptor("default", dnsLog.tuple[0], dnsLog.descriptor),
      receiveLogTuples([connLog.tuple, dnsLog.tuple])
    ])

    const tableColumns = getCurrentTableColumns(state)
    expect(tableColumns.toArray()).toHaveLength(39)
  })
})
