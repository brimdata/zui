import {ipcRenderer} from "electron"
import tabHistory from "src/app/router/tab-history"
import {lakeQueryPath} from "src/app/router/utils/paths"
import brim from "../../brim"
import Current from "../Current"
import SessionQueries from "../SessionQueries"
import TabHistories from "../TabHistories"
import {Thunk} from "../types"
import Tabs from "./"
import {findTabById, findTabByUrl, findQuerySessionTab} from "./find"

export const create =
  (url = "/", id = brim.randomHash()): Thunk<string> =>
  (dispatch) => {
    dispatch(SessionQueries.init(id))
    dispatch(Tabs.add(id))
    dispatch(Tabs.activate(id))
    global.tabHistories.create(id).replace(url)
    return id
  }

export const createQuerySession = (): Thunk<string> => (dispatch, getState) => {
  const id = brim.randomHash()
  const lakeId = Current.getLakeId(getState())
  const url = lakeQueryPath(id, lakeId, null)
  return dispatch(create(url, id))
}

export const previewUrl =
  (url: string): Thunk =>
  (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    const previewId = Tabs.getPreview(getState())
    const previewTab = previewId && findTabById(tabs, previewId)
    const tab = findTabByUrl(tabs, url)

    if (tab) {
      dispatch(Tabs.activate(tab.id))
    } else if (previewTab) {
      global.tabHistories.delete(previewId)
      global.tabHistories.create(previewId).push(url)
      dispatch(Tabs.activate(previewId))
    } else {
      const id = dispatch(Tabs.create(url))
      dispatch(Tabs.preview(id))
    }
  }

export const activateUrl =
  (url: string): Thunk =>
  (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    const tab = findTabByUrl(tabs, url)
    const previewId = Tabs.getPreview(getState())
    if (tab) {
      dispatch(Tabs.activate(tab.id))
    } else {
      dispatch(Tabs.create(url))
    }
    if (tab?.id === previewId) {
      dispatch(Tabs.preview(null))
    }
  }

export const activateQuerySession =
  (url: string): Thunk =>
  (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    let tab = findQuerySessionTab(tabs)
    if (tab) {
      dispatch(Tabs.activate(tab.id))
      dispatch(tabHistory.push(url))
    } else {
      dispatch(Tabs.create(url))
    }
  }

export const closeActive = (): Thunk => (dispatch, getState) => {
  const tabs = Tabs.getData(getState())
  if (tabs.length === 1) {
    ipcRenderer.invoke("windows:close")
  } else {
    const id = Tabs.getActive(getState())
    dispatch(Tabs.remove(id))
  }
}

// export const closeTab =
//   (id: string): Thunk =>
//   (dispatch, getState) => {
//     dispatch(Tabs.remove(id))
//   }

export const activateNext = (): Thunk => (dispatch, getState) => {
  const id = Tabs.getActive(getState())
  const tabs = Tabs.getData(getState())
  const index = tabs.findIndex((tab) => tab.id === id)
  const next = tabs[(index + 1) % tabs.length]
  dispatch(Tabs.activate(next.id))
}

export const activatePrev = (): Thunk => (dispatch, getState) => {
  const id = Tabs.getActive(getState())
  const tabs = Tabs.getData(getState())
  const index = tabs.findIndex((tab) => tab.id === id)
  const next = tabs[(tabs.length + index - 1) % tabs.length]
  dispatch(Tabs.activate(next.id))
}

export const activateByIndex =
  (index: number): Thunk =>
  (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    const tab = tabs[index]
    if (tab) dispatch(Tabs.activate(tab.id))
  }

export const activateLast = (): Thunk => (dispatch, getState) => {
  const tabs = Tabs.getData(getState())
  const tab = tabs[tabs.length - 1]
  if (tab) dispatch(Tabs.activate(tab.id))
}
