/* @flow */
import {ipcRenderer} from "electron"

import type {Store} from "../state/types"
import Layout from "../state/Layout"
import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import View from "../state/View"
import exportResults from "../flows/exportResults"
import getPersistable from "../state/getPersistable"

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
    store.dispatch(Layout.toggleRightSidebar())
  })

  ipcRenderer.on("resetState", () => {
    /* Will implement soon */
  })

  ipcRenderer.on("getState", (event, channel) => {
    ipcRenderer.send(channel, getPersistable(store.getState()))
  })

  ipcRenderer.on("getState", (event, channel) => {
    ipcRenderer.send(channel, getPersistable(store.getState()))
  })

  ipcRenderer.on("exportResults", (e, filePath) => {
    store.dispatch(exportResults(filePath))
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
