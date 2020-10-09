import {screen, BrowserWindow} from "electron"
import {getWindowDimens} from "../dimens"

import {WindowName} from "./windowManager"

export type WindowParams = {
  size: [number, number]
  position?: [number, number]
  query: Object
  id: string
}

export default function window(name: WindowName, params: WindowParams) {
  switch (name) {
    case "search":
      return searchWindow(params)
    case "about":
      return aboutWindow()
    case "detail":
      return detailWindow(params)
    default:
      throw new Error(`Unknown window name: ${name}`)
  }
}

function searchWindow(params) {
  const {size, position, query, id} = params
  const desired = {
    x: position[0],
    y: position[1],
    width: size[0],
    height: size[1]
  }
  const defaults = {x: undefined, y: undefined, width: 1250, height: 750}
  const screens = screen.getAllDisplays().map((s) => s.workArea)
  const dimens = getWindowDimens(desired, defaults, screens)
  const win = new BrowserWindow({
    titleBarStyle: "hidden",
    resizable: true,
    minWidth: 480,
    minHeight: 100,
    ...dimens,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
      enableRemoteModule: true
    }
  }).on("close", (e: any) => {
    // Close handled by the search renderer
    e.preventDefault()
    e.sender.webContents.send("close")
  })

  win.loadFile("search.html", {query: {...query, id}})

  return win
}

function aboutWindow() {
  const win = new BrowserWindow({
    resizable: false,
    minimizable: false,
    maximizable: false,
    width: 360,
    height: 360,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  win.setMenu(null)
  win.center()
  win.loadFile("about.html")
  return win
}

function detailWindow(params) {
  const {size, position, query, id} = params
  const win = new BrowserWindow({
    resizable: true,
    width: 360,
    height: 360,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  if (size) {
    win.setSize(size[0], size[1])
  }
  if (position) {
    win.setPosition(position[0], position[1])
  } else {
    win.center()
  }

  win.loadFile("detail.html", {query: {...query, id}})

  return win
}
