import {isEmpty} from "lodash"
import produce from "immer"

import {AddTabData, TabActions, TabsState} from "./types"
import {TabState} from "../Tab/types"
import {last} from "../../lib/Array"
import lib from "../../lib"
import tabReducer from "../Tab/reducer"
import {AnyAction} from "redux"

const firstTab = tabReducer(undefined, {type: "INIT"})
const init = {
  active: firstTab.id,
  data: [firstTab]
}

export default function reducer(state: TabsState = init, action: TabActions) {
  if (reduxAction(action)) return forwardToAllTabs(state, action)
  if (tabAction(action)) return forwardToTab(state, action)

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
    case "TABS_ACTIVE_CLEAR":
      var index = state.data.findIndex((t) => t.id === state.active)
      var tabs = [...state.data]
      tabs[index] = tabReducer({id: state.active}, {type: "@INIT"})
      return {
        ...state,
        data: tabs
      }

    default:
      return state
  }
}

function addTabData(stateData, {id, data}: {id: string; data: AddTabData}) {
  const initialState = tabReducer(undefined, {type: "INIT"})
  const tab = produce(initialState, (draft) => {
    draft.id = id
    if (data) {
      draft.current.connectionId = data.connectionId
      draft.current.spaceId = data.spaceId
    }
  })
  return [...stateData, tab]
}

function removeTab(state: TabsState, id) {
  const data: TabState[] = state.data.filter((t) => t.id !== id)

  if (id === state.active) {
    const index = indexOf(state.data, id)
    const lastTab = index + 1 === state.data.length
    const active = lastTab ? last(data).id : data[index].id

    return {data, active}
  } else {
    return {data, active: state.active}
  }
}

function moveTab(state, action) {
  const index = state.data.findIndex((t) => t.id === action.id)
  if (index === action.index) return state
  return {
    ...state,
    data: lib.move<TabState>(state.data, index, action.index)
  }
}

function orderTabs(tabs, indices) {
  const newTabs = lib.compact(lib.uniq(indices).map((i: number) => tabs[i]))
  return isEmpty(newTabs) ? tabs : newTabs
}

function tabAction({type}) {
  return (
    type.startsWith("SEARCH_") ||
    type.startsWith("VIEWER_") ||
    type.startsWith("CHART_") ||
    type.startsWith("COLUMNS_") ||
    type.startsWith("HISTORY_") ||
    type.startsWith("LOG_DETAIL_") ||
    type.startsWith("LAYOUT_") ||
    type.startsWith("CURRENT_") ||
    type.startsWith("LAST_")
  )
}

function forwardToTab(state, action: AnyAction) {
  const {data, active} = state
  const id = action.tabId || active
  const index = indexOf(data, id)
  const tab = data[index]
  const newData = [...data]
  newData[index] = tabReducer(tab, action)
  return {
    active,
    data: newData
  }
}

function indexOf(data, id) {
  return data.findIndex((t) => t.id === id)
}

function reduxAction(action) {
  /* Redux dispatches a few actions that start with @@ to populate the store
    with all the initial states. When our app starts up, we want to populate
    each tab with it's initial state since we don't persist the entire state
    of each tab. */
  return action.type.startsWith("@@")
}

function forwardToAllTabs(state, action) {
  return {
    ...state,
    data: state.data.map((tabState) => tabReducer(tabState, action))
  }
}
