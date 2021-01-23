import {ipcRenderer} from "electron"

import {AppDispatch, Store} from "../state/types"
import Layout from "../state/Layout"
import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import getPersistable from "../state/getPersistable"
import initNewSearchTab from "./initNewSearchTab"
import confirmUnload from "../flows/confirmUnload"
import deletePartialSpaces from "../flows/deletePartialSpaces"
import {globalDispatch} from "../state/GlobalContext"
import Workspaces from "../state/Workspaces"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {Authenticator} from "../auth0"

export default (store: Store) => {
  const dispatch = store.dispatch as AppDispatch

  ipcRenderer.on("confirmClose", async (e, replyChannel) => {
    const confirmed = await dispatch(confirmUnload())
      .then(() => true)
      .catch(() => false)
    ipcRenderer.send(replyChannel, confirmed)
  })

  ipcRenderer.on("prepareClose", async (e, replyChannel) => {
    await dispatch(deletePartialSpaces())
    ipcRenderer.send(replyChannel)
  })

  ipcRenderer.on("pinSearch", () => {
    store.dispatch(SearchBar.pinSearchBar())
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
    store.dispatch(SearchBar.removeAllSearchBarPins())
    store.dispatch(SearchBar.changeSearchBarInput(""))
  })

  ipcRenderer.on("toggleLeftSidebar", () => {
    store.dispatch(Layout.toggleLeftSidebar())
  })

  ipcRenderer.on("toggleRightSidebar", () => {
    store.dispatch(Layout.toggleRightSidebar())
  })

  ipcRenderer.on("getState", (event, channel) => {
    ipcRenderer.send(channel, getPersistable(store.getState()))
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

  ipcRenderer.on("windows:authCallback", (e, {workspaceId, accessToken}) => {
    const ws = Workspaces.id(workspaceId)(store.getState())
    new Authenticator()
      .loadTokens(cbUrl)
      .then((token) => {
        const win = brim.windows.getWindow(windowId)
        sendTo(win.ref.webContents, ipc.windows.authCallback(workspaceId, code))
      })
      .catch((e) => {
        log.error("error loading tokens: ", e)
      })
    dispatch(Workspaces.setWorkspaceToken(workspaceId, accessToken))
    globalDispatch(Workspaces.setWorkspaceToken(workspaceId, accessToken)).then(
      () => {
        dispatch(WorkspaceStatuses.set(workspaceId, "connected"))
      }
    )
  })
  ipcRenderer.on("globalStore:dispatch", (e, {action}) =>
    store.dispatch(action)
  )
}
