import {ipcRenderer} from "electron"

import {Thunk} from "../types"
import Tabs from "./"
import brim from "../../brim"

export default {
  new: (spaceId: string | null = null): Thunk => (dispatch, getState) => {
    const {
      current: {connectionId}
    } = Tabs.getActiveTab(getState())
    const id = brim.randomHash()
    dispatch(Tabs.add(id, {connectionId, spaceId}))
    dispatch(Tabs.activate(id))
    const el = document.getElementById("main-search-input")
    if (el) el.focus()
  },

  closeActive: (): Thunk => (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    if (tabs.length === 1) {
      ipcRenderer.invoke("windows:close")
    } else {
      const id = Tabs.getActive(getState())
      dispatch(Tabs.remove(id))
    }
  },

  activateNext: (): Thunk => (dispatch, getState) => {
    const id = Tabs.getActive(getState())
    const tabs = Tabs.getData(getState())
    const index = tabs.findIndex((tab) => tab.id === id)
    const next = tabs[(index + 1) % tabs.length]
    dispatch(Tabs.activate(next.id))
  },

  activatePrev: (): Thunk => (dispatch, getState) => {
    const id = Tabs.getActive(getState())
    const tabs = Tabs.getData(getState())
    const index = tabs.findIndex((tab) => tab.id === id)
    const next = tabs[(tabs.length + index - 1) % tabs.length]
    dispatch(Tabs.activate(next.id))
  },

  activateByIndex: (index: number): Thunk => (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    const tab = tabs[index]
    if (tab) dispatch(Tabs.activate(tab.id))
  },

  activateLast: (): Thunk => (dispatch, getState) => {
    const tabs = Tabs.getData(getState())
    const tab = tabs[tabs.length - 1]
    if (tab) dispatch(Tabs.activate(tab.id))
  }
}
