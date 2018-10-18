import {ipcRenderer} from "electron"
import {pinSearchBar, removeAllSearchBarPins} from "../actions/searchBar"
import {toggleLeftSidebar, toggleRightSidebar} from "../actions/view"
import {clearState} from "./persistance"

export default store => {
  ipcRenderer.on("pinSearch", () => store.dispatch(pinSearchBar()))
  ipcRenderer.on("focusSearchBar", () => {
    const el = document.getElementById("main-search-input")
    el && el.focus()
    el && el.select()
  })
  ipcRenderer.on("clearPins", () => store.dispatch(removeAllSearchBarPins()))
  ipcRenderer.on("toggleLeftSidebar", () => store.dispatch(toggleLeftSidebar()))
  ipcRenderer.on("toggleRightSidebar", () =>
    store.dispatch(toggleRightSidebar())
  )
  ipcRenderer.on("resetState", () => {
    clearState()
    location.reload()
  })
}
