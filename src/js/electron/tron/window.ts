import {BrowserWindow} from "electron"

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
  const win = new BrowserWindow({
    titleBarStyle: "hidden",
    resizable: true,
    minWidth: 480,
    minHeight: 100,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  }).on("close", (e: any) => {
    // Close handled by the search renderer
    e.preventDefault()
    e.sender.webContents.send("close")
  })

  if (size) {
    const [width, height] = size
    win.setSize(width, height)
  }
  if (position) {
    const [x, y] = position
    win.setPosition(x, y)
  } else {
    win.center()
  }
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
      nodeIntegration: true
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
      nodeIntegration: true
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
