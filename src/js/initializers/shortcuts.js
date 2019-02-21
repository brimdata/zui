import {ipcRenderer} from "electron"

import {clearState} from "./persistance"
import {
  pinSearchBar,
  removeAllSearchBarPins,
  changeSearchBarInput
} from "../actions/searchBar"
import {showModal, toggleLeftSidebar, toggleRightSidebar} from "../actions/view"

export default store => {
  ipcRenderer.on("pinSearch", () => {
    store.dispatch(pinSearchBar())
  })

  ipcRenderer.on("focusSearchBar", () => {
    const el = document.getElementById("main-search-input")
    el && el.focus()
    el && el.select()
  })

  ipcRenderer.on("clearPins", () => {
    store.dispatch(removeAllSearchBarPins())
    store.dispatch(changeSearchBarInput(""))
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
