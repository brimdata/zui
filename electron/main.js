const {app, BrowserWindow, dialog, Menu} = require("electron")
const {createMenu} = require("./menu")
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require("electron-devtools-installer")

let win

const installExtensions = () => {
  installExtension(REACT_DEVELOPER_TOOLS).catch(err =>
    console.log("An error occurred: ", err)
  )

  installExtension(REDUX_DEVTOOLS).catch(err =>
    console.log("An error occurred: ", err)
  )
}

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 1200,
    backgroundColor: "#ffffff",
    titleBarStyle: "hidden"
  })
  win.loadFile("index.html")
  win.setMenu(null)
  win.on("closed", () => {
    win = null
  })
  const menu = createMenu(win)
  Menu.setApplicationMenu(menu)
}

app.on("ready", () => {
  createWindow()
  installExtensions()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (win === null) {
    createWindow()
  }
})
