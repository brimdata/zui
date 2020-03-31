/* @flow */
import {ipcRenderer} from "electron"

import type {Store} from "../state/types"
import {clearState} from "./initPersistance"
import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import View from "../state/View"

export default (store: Store) => {
  ipcRenderer.on("pinSearch", () => {
    store.dispatch(SearchBar.pinSearchBar())
  })

  ipcRenderer.on("focusSearchBar", () => {
    const el = document.getElementById("main-search-input")

    el && el.focus()
    // $FlowFixMe
    el && el.select()
  })

  ipcRenderer.on("clearPins", () => {
    store.dispatch(SearchBar.removeAllSearchBarPins())
    store.dispatch(SearchBar.changeSearchBarInput(""))
  })

  ipcRenderer.on("toggleLeftSidebar", () => {
    store.dispatch(View.toggleLeftSidebar())
  })

  ipcRenderer.on("toggleRightSidebar", () => {
    store.dispatch(View.toggleRightSidebar())
  })

  ipcRenderer.on("resetState", () => {
    clearState()
    location.reload()
  })

  ipcRenderer.on("showPreferences", () => {
    store.dispatch(Modal.show("settings"))
  })

  ipcRenderer.on("showAbout", () => {
    store.dispatch(Modal.show("about"))
  })

  ipcRenderer.on("back", () => {
    store.dispatch(SearchBar.goBack())
  })

  ipcRenderer.on("forward", () => {
    store.dispatch(SearchBar.goForward())
  })

  ipcRenderer.on("closeTab", () => {
    store.dispatch(Tabs.closeActive())
  })
}
