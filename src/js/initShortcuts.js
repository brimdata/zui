import {ipcRenderer} from "electron"
import {pinSearchBar} from "./actions/searchBar"

export default store => {
  ipcRenderer.on("pinSearch", () => store.dispatch(pinSearchBar()))
}
