import {releaseNotesPath} from "src/app/router/utils/paths"
import {ipcRenderer} from "electron"
import confirmUnload from "../flows/confirmUnload"
import deletePartialPools from "../flows/deletePartialPools"
import Appearance from "../state/Appearance"
import Current from "../state/Current"
import {getPersistedWindowState} from "../state/stores/get-persistable"
import Layout from "../state/Layout"
import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import TabHistories from "../state/TabHistories"
import Tabs from "../state/Tabs"
import {AppDispatch, Store} from "../state/types"
import initNewSearchTab from "./initNewSearchTab"
import PluginManager from "./pluginManager"
import Editor from "../state/Editor"
import submitSearch from "src/app/query-home/flows/submit-search"
import {commands} from "src/app/commands/command"

export default (store: Store, pluginManager: PluginManager) => {
  const dispatch = store.dispatch as AppDispatch
  ipcRenderer.on("confirmClose", async (e, replyChannel) => {
    const confirmed = await dispatch(confirmUnload())
      .then(() => true)
      .catch(() => false)
    ipcRenderer.send(replyChannel, confirmed)
  })

  ipcRenderer.on("prepareClose", async (e, replyChannel) => {
    await pluginManager.deactivate()
    await dispatch(deletePartialPools())
    store.dispatch(TabHistories.save(global.tabHistories.serialize()))
    ipcRenderer.send(replyChannel)
  })

  ipcRenderer.on("pinSearch", () => {
    store.dispatch(SearchBar.pinSearchBar())
    store.dispatch(Editor.pinValue())
    store.dispatch(submitSearch())
  })

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
}
