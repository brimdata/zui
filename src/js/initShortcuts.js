import {ipcRenderer} from "electron"
import {pinSearchBar, removeAllSearchBarPins} from "./actions/searchBar"

export default store => {
  ipcRenderer.on("pinSearch", () => store.dispatch(pinSearchBar()))
  ipcRenderer.on("focusSearchBar", () => {
    const el = document.getElementById("main-search-input")
    el && el.focus()
    el && el.select()
  })
  ipcRenderer.on("clearPins", () => store.dispatch(removeAllSearchBarPins()))
}
