/* @flow */
import {ipcRenderer} from "electron"

import type {Store} from "../reducers/types"
import {clearState} from "./initPersistance"
import {
  pinSearchBar,
  removeAllSearchBarPins,
  changeSearchBarInput
} from "../actions/searchBar"
import {
  showModal,
  toggleLeftSidebar,
  toggleRightSidebar,
  toggleSearchInspector
} from "../actions/view"

export default (store: Store) => {
  ipcRenderer.on("pinSearch", () => {
    store.dispatch(pinSearchBar())
  })

  ipcRenderer.on("focusSearchBar", () => {
    const el = document.getElementById("main-search-input")

    el && el.focus()
    // $FlowFixMe
    el && el.select()
  })

  ipcRenderer.on("clearPins", () => {
    store.dispatch(removeAllSearchBarPins())
    store.dispatch(changeSearchBarInput(""))
  })

  ipcRenderer.on("toggleSearchInspector", () => {
    store.dispatch(toggleSearchInspector())
  })

  ipcRenderer.on("toggleLeftSidebar", () => {
    store.dispatch(toggleLeftSidebar())
  })

  ipcRenderer.on("toggleRightSidebar", () => {
    store.dispatch(toggleRightSidebar())
  })

  ipcRenderer.on("resetState", () => {
    clearState()
    location.reload()
  })

  ipcRenderer.on("showPreferences", () => {
    store.dispatch(showModal("settings"))
  })
}
