const {app, BrowserWindow} = require("electron")

let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 1200,
    backgroundColor: "#ffffff"
  })
  win.openDevTools()
  win.loadFile("index.html")
  win.setMenu(null)
  win.on("closed", () => {
    win = null
  })
}

app.on("ready", createWindow)

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
