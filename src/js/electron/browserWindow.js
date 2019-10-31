/* @flow */
import {BrowserWindow, Menu} from "electron"

import type {Keep} from "../lib/keep"
import menu from "./menu"

export type WindowName = "login" | "search"

export default function window(state: Keep) {
  let win = null
  let name = "login"

  function setState(field, value) {
    state.set(name + "." + field, value)
  }

  function getState(field) {
    return state.get(name + "." + field)
  }

  function getMenuBuilder() {
    switch (name) {
      case "search":
        return menu.searchAppMenu
      case "login":
        return menu.loginAppMenu
      default:
        throw "Unknown Menu"
    }
  }

  return {
    create() {
      let {
        position: [x, y],
        size: [width, height]
      } = state.get(name)

      win = new BrowserWindow({
        titleBarStyle: "hidden",
        height,
        width,
        x,
        y,
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
      this.setMenu()
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
    },

    setMenu() {
      function send(msg) {
        if (!win) return
        win.webContents.send(msg)
      }

      let template = getMenuBuilder()(send)
      Menu.setApplicationMenu(Menu.buildFromTemplate(template))
      return this
    }
  }
}
