/* @flow */

import type {SearchActions} from "../search/types"
import type {TabActions, TabsState} from "./"
import {swap} from "../../lib/Array"
import initialState, {initTab} from "./initialState"
import search from "../search"

export default function reducer(
  state: TabsState = initialState(),
  action: TabActions | SearchActions
) {
  if (action.type.startsWith("SEARCH_")) {
    let {data, active} = state
    let tab = data[active]
    let updates = search.reducer(tab, action)
    let newData = [...data]
    newData[active] = {...tab, ...updates}
    return {
      active,
      data: newData
    }
  }

  switch (action.type) {
    case "TABS_ACTIVATE":
      return {
        ...state,
        active: action.id
      }
    case "TABS_REMOVE":
      if (state.data.length === 1) return state
      return {
        active: removeTabActive(state.data.length, state.active, action.id),
        data: removeTabData(state.data, action.id)
      }
    case "TABS_ADD":
      return {
        active: state.active,
        data: addTabData(state.data, action.data)
      }
    case "TABS_MOVE":
      return {
        ...state,
        data: swap(state.data, action.from, action.to)
      }
    default:
      return state
  }
}

function addTabData(stateData, actionData) {
  let tab = {...initTab(), ...actionData}
  return [...stateData, tab]
}

function removeTabActive(length: number, activeId: number, removeId: number) {
  if (activeId === removeId && activeId === length - 1) {
    return activeId - 1
  } else if (activeId > removeId) {
    return activeId - 1
  } else {
    return activeId
  }
}

function removeTabData(data, id) {
  let newData = [...data]
  newData.splice(id, 1)
  return newData
}
