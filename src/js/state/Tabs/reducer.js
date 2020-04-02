/* @flow */

import {isEmpty} from "lodash"

import type {TabActions, TabsState} from "./types"
import type {TabState} from "../Tab/types"
import {last} from "../../lib/Array"
import lib from "../../lib"
import tabReducer from "../Tab/reducer"

let firstTab = tabReducer(undefined, {type: "INIT"})
let init = {
  active: firstTab.id,
  data: [firstTab]
}

export default function reducer(state: TabsState = init, action: TabActions) {
  if (tabAction(action)) return updateTab(state, action)

  switch (action.type) {
    case "TABS_ACTIVATE":
      if (state.data.map((t) => t.id).includes(action.id))
        return {
          ...state,
          active: action.id
        }
      else {
        return state
      }
    case "TABS_REMOVE":
      if (state.data.length === 1) return state
      return removeTab(state, action.id)
    case "TABS_ADD":
      return {
        active: state.active,
        data: addTabData(state.data, action)
      }
    case "TABS_MOVE":
      return moveTab(state, action)
    case "TABS_ORDER":
      return {
        ...state,
        data: orderTabs(state.data, action.indices)
      }
    default:
      return state
  }
}

function addTabData(stateData, {id, data}) {
  let initialState = tabReducer(undefined, {type: "INIT"})
  let search = {...initialState.search, ...data}
  let tab = {...initialState, ...{search}, id}
  return [...stateData, tab]
}

function removeTab(state: TabsState, id) {
  let data: TabState[] = state.data.filter((t) => t.id !== id)

  if (id === state.active) {
    let index = indexOf(state.data, id)
    let lastTab = index + 1 === state.data.length
    let active = lastTab ? last(data).id : data[index].id

    return {data, active}
  } else {
    return {data, active: state.active}
  }
}

function moveTab(state, action) {
  let index = state.data.findIndex((t) => t.id === action.id)
  if (index === action.index) return state
  return {
    ...state,
    data: lib.move<TabState>(state.data, index, action.index)
  }
}

function orderTabs(tabs, indices) {
  let newTabs = lib.compact(lib.uniq(indices).map<TabState>((i) => tabs[i]))
  return isEmpty(newTabs) ? tabs : newTabs
}

function tabAction({type}) {
  return (
    type.startsWith("SEARCH_") ||
    type.startsWith("VIEWER_") ||
    type.startsWith("CHART_") ||
    type.startsWith("COLUMNS_") ||
    type.startsWith("HISTORY_")
  )
}

function updateTab(state, action: Object) {
  let {data, active} = state
  let id = action.tabId || active
  let index = indexOf(data, id)
  let tab = data[index]
  let newData = [...data]
  newData[index] = tabReducer(tab, action)
  return {
    active,
    data: newData
  }
}

function indexOf(data, id) {
  return data.findIndex((t) => t.id === id)
}
