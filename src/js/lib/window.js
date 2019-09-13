/* @flow */
import {BrowserWindow} from "electron"

import {setAppMenu} from "../electron/setAppMenu"

export type WindowName = "login" | "search"

export default function window(state: Object) {
  let win = null
  let name = "login"

  function setState(field, value) {
    state.set(name + "." + field, value)
  }

  function getState(field) {
    return state.get(name + "." + field)
  }

  return {
    create() {
      win = new BrowserWindow({
        titleBarStyle: "hidden",
        webPreferences: {
          experimentalFeatures: true,
          nodeIntegration: true
        }
      })
      win.setMenu(null)
      win.on("closed", this.destroy)
      win.on("resize", this.saveSize)
      win.on("move", this.savePosition)
      win.loadFile("index.html")
    },

    switchTo(newName: WindowName) {
      if (!win) return
      name = newName
      this.setPosition()
      this.setSize()
      setAppMenu(name)
    },

    exists() {
      return win != null
    },

    async destroy() {
      await state.save()
      win = null
    },

    saveSize() {
      if (win) setState("size", win.getSize())
    },

    savePosition() {
      if (win) setState("position", win.getPosition())
    },

    setSize() {
      if (win) win.setSize(...getState("size"))
    },

    setPosition() {
      if (!win) return
      let pos = getState("position")
      if (pos === "center") win.center()
      else win.setPosition(...pos)
    }
  }
}
