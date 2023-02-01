import {releaseNotesPath} from "src/app/router/utils/paths"
import {ipcRenderer} from "electron"
import Appearance from "../state/Appearance"
import Current from "../state/Current"
import {getPersistedWindowState} from "../state/stores/get-persistable"
import Layout from "../state/Layout"
import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"
import initNewSearchTab from "./initNewSearchTab"
import Editor from "../state/Editor"
import submitSearch from "src/app/query-home/flows/submit-search"
import {commands} from "src/app/commands/command"
import {decode, zed} from "@brimdata/zealot"
import {viewLogDetail} from "../flows/viewLogDetail"

export default (store: Store) => {
  ipcRenderer.on("focusSearchBar", () => {
    const el = document.getElementById("main-search-input")

    if (el) {
      el.focus()
      // @ts-ignore
      el.select()
    }
  })

  ipcRenderer.on("clearPins", () => {
    store.dispatch(Editor.deleteAllPins())
    store.dispatch(Editor.setValue(""))
    store.dispatch(submitSearch())
  })

  ipcRenderer.on("toggleLeftSidebar", () => {
    store.dispatch(Appearance.toggleSidebar())
  })

  ipcRenderer.on("toggleRightSidebar", () => {
    store.dispatch(Layout.toggleDetailPane())
  })

  ipcRenderer.on("getState", (event, channel) => {
    ipcRenderer.send(channel, getPersistedWindowState(store.getState()))
  })

  ipcRenderer.on("showPreferences", () => {
    store.dispatch(Modal.show("settings"))
  })

  ipcRenderer.on("showExportResults", () => {
    store.dispatch(Modal.show("export"))
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

  ipcRenderer.on("windows:newSearchTab", (e, {params}) => {
    initNewSearchTab(store, params)
  })

  ipcRenderer.on("globalStore:dispatch", (e, {action}) =>
    store.dispatch(action)
  )

  ipcRenderer.on("showReleaseNotes", () => {
    const id = Current.getLakeId(store.getState())
    store.dispatch(Tabs.create(releaseNotesPath(id)))
  })

  ipcRenderer.on("toggleHistogram", () => {
    store.dispatch(Layout.toggleHistogram())
  })

  ipcRenderer.on("runCommand", (e, id, ...args) => {
    commands.run(id, ...args)
  })

  ipcRenderer.on("detail-window-args", (e, opts) => {
    if (opts) {
      global.windowHistory.replace(opts.url)
      const value = decode(opts.value) as zed.Record
      if (value) {
        store.dispatch(viewLogDetail(value))
      }
    }
  })
}
