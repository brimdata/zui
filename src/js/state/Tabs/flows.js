/* @flow */
import {ipcRenderer} from "electron"

import type {Thunk} from "../types"
import Tabs from "./"
import brim from "../../brim"

export default {
  new: (): Thunk => (dispatch, getState) => {
    let {search} = Tabs.getActiveTab(getState())
    let id = brim.randomHash()
    dispatch(Tabs.add(id, {...search, spaceID: "", spaceName: ""}))
    dispatch(Tabs.activate(id))
    let el = document.getElementById("main-search-input")
    if (el) el.focus()
  },

  closeActive: (): Thunk => (dispatch, getState) => {
    let tabs = Tabs.getData(getState())
    if (tabs.length === 1) {
      ipcRenderer.invoke("windows:close")
    } else {
      let id = Tabs.getActive(getState())
      dispatch(Tabs.remove(id))
    }
  },

  activateNext: (): Thunk => (dispatch, getState) => {
    let id = Tabs.getActive(getState())
    let tabs = Tabs.getData(getState())
    let index = tabs.findIndex((tab) => tab.id === id)
    let next = tabs[(index + 1) % tabs.length]
    dispatch(Tabs.activate(next.id))
  },

  activatePrev: (): Thunk => (dispatch, getState) => {
    let id = Tabs.getActive(getState())
    let tabs = Tabs.getData(getState())
    let index = tabs.findIndex((tab) => tab.id === id)
    let next = tabs[(tabs.length + index - 1) % tabs.length]
    dispatch(Tabs.activate(next.id))
  },

  activateByIndex: (index: number): Thunk => (dispatch, getState) => {
    let tabs = Tabs.getData(getState())
    let tab = tabs[index]
    if (tab) dispatch(Tabs.activate(tab.id))
  },

  activateLast: (): Thunk => (dispatch, getState) => {
    let tabs = Tabs.getData(getState())
    let tab = tabs[tabs.length - 1]
    if (tab) dispatch(Tabs.activate(tab.id))
  }
}
