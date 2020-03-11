/* @flow */
import {BrowserWindow} from "electron"

import {type WindowName} from "./windowManager"

export type WindowParams = {
  size: [number, number],
  position?: [number, number],
  query: Object,
  id: string
}

export default function window(name: WindowName, params: WindowParams) {
  let {size, position, query, id} = params
  let win = new BrowserWindow({
    titleBarStyle: "hidden",
    resizable: true,
    minWidth: 480,
    minHeight: 100,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  })

  if (size) {
    win.setSize(...size)
  }
  if (position) {
    win.setPosition(...position)
  } else {
    win.center()
  }
  win.loadFile(`${name}.html`, {query: {...query, id}})

  return win
}
