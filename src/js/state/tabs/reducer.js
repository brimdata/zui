/* @flow */

import type {SearchActions} from "../search/types"
import type {TabActions, TabsState} from "./"
import {last} from "../../lib/Array"
import initialState, {initTab} from "./initialState"
import search from "../search"

export default function reducer(
  state: TabsState = initialState(),
  action: TabActions | SearchActions
) {
  if (action.type.startsWith("SEARCH_")) {
    let {data, active} = state
    let tab = data[active.toString()]
    return {
      active,
      data: {
        ...data,
        [active]: {
          ...tab,
          ...search.reducer(tab, action)
        }
      }
    }
  }

  switch (action.type) {
    case "TABS_ACTIVATE":
      return {
        ...state,
        active: action.id
      }
    case "TABS_REMOVE":
      if (Object.keys(state.data).length === 1) return state
      return {
        active: removeTabActive(parseIds(state.data), state.active, action.id),
        data: removeTabData(state.data, action.id)
      }
    case "TABS_ADD":
      return {
        active: state.active,
        data: addTabData(state.data, action.data)
      }
    default:
      return state
  }
}

function parseIds(data) {
  return Object.keys(data)
    .map((k) => parseInt(k))
    .sort()
}

function initId(state): string {
  return Object.keys(state).length.toString()
}

function addTabData(stateData, actionData) {
  let id = initId(stateData)
  let tab = {...initTab(), ...actionData}
  return {...stateData, [id]: tab}
}

function removeTabActive(ids: number[], activeId: number, removeId: number) {
  if (activeId === removeId && activeId === last(ids)) {
    return activeId - 1
  } else if (activeId > removeId) {
    return activeId - 1
  } else {
    return activeId
  }
}

function removeTabData(data, id) {
  let newData = {...data}
  delete newData[id.toString()]
  return newData
}
