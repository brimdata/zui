/* @flow */
import type {Thunk} from "../state/types"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import executeHistogramSearch from "./executeHistogramSearch"
import Columns from "../state/Columns"
import zngToZeekTypes from "../brim/flatRecordsBuffer/zngToZeekTypes"
import nestedRecord from "../brim/flatRecordsBuffer/nestedRecord"
import {isArray} from "../lib/is"
import executeTableSearch from "./executeTableSearch"

export default function submitAutoRefreshSearch(): Thunk {
  return function(dispatch, getState, {zealot}) {
    const state = getState()
    const prevArgs = Search.getArgs(state)
    if (!dispatch(SearchBar.validate())) return Promise.reject()

    const tabId = Tabs.getActive(state)
    const args = Search.getArgs(state)
    const spaceId = Tab.getSpaceId(state)
    const {tableProgram, span} = args
    const [from, to] = span

    switch (args.type) {
      case "analytics":
      case "zoom":
        return dispatch(executeTableSearch(tabId, args, true))
      default:
        dispatch(executeHistogramSearch(tabId, args, prevArgs))
        return dispatch(executeTableSearch(tabId, args, true))
    }

    // getAndSetRecords(zealot, tableProgram, {from, to, spaceId}).then(
    //   ({records, columns}) => {
    //     dispatch(Viewer.setRecords(tabId, records))
    //     dispatch(Viewer.updateColumns(tabId, columns))
    //     dispatch(Columns.touch(columns))
    //   }
    // )
  }
}

// const getAndSetRecords = async (zealot, program, args) => {
//   const stream = await zealot.search(program, args)
//
//   const collectedRecords = []
//   const types = {}
//   for await (let payload of stream) {
//     const {records} = payload
//     if (!records) {
//       continue
//     }
//     const newRecords = records.map((r) => {
//       if (r.type) types[r.id] = zngToZeekTypes(r.type)
//       return nestedRecord(r.values, types[r.id]).flatten()
//     })
//     collectedRecords.push(...newRecords)
//   }
//
//   const columns = Object.keys(types).reduce((all, id) => {
//     all[id] = flattenType(types[id])
//     return all
//   }, {})
//
//   return {collectedRecords, columns}
// }
//
// function flattenType(descriptor, prefix = "") {
//   return descriptor.reduce((flat, {name, type}) => {
//     let cols = isArray(type)
//       ? flattenType(type, `${prefix}${name}.`)
//       : [{name: prefix + name, type}]
//
//     return flat.concat(cols)
//   }, [])
// }
