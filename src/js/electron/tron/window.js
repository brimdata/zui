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
  let [width, height] = size
  let win = new BrowserWindow({
    titleBarStyle: "hidden",
    resizable: true,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  })

  if (position) {
    win.setPosition(...position)
  } else {
    win.center()
  }
  win.loadFile(`${name}.html`, {query: {...query, id}})

  return win
}
