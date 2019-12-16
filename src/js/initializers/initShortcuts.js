/* @flow */
import {ipcRenderer} from "electron"

import type {Store} from "../state/types"
import {
  changeSearchBarInput,
  pinSearchBar,
  removeAllSearchBarPins,
  toggleLeftSidebar,
  toggleRightSidebar
} from "../state/actions"
import {clearState} from "./initPersistance"
import {goBack, goForward} from "../state/thunks/searchBar"
import {toggleSearchInspector} from "../state/thunks/view"
import modal from "../state/modal"

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
    store.dispatch(modal.show("settings"))
  })

  ipcRenderer.on("back", () => {
    store.dispatch(goBack())
  })

  ipcRenderer.on("forward", () => {
    store.dispatch(goForward())
  })
}
