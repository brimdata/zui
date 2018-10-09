const {app, Menu} = require("electron")

module.exports = {
  createMenu: browserWindow => {
    const template = [
      {
        label: "Edit",
        submenu: [
          {role: "undo"},
          {role: "redo"},
          {type: "separator"},
          {role: "cut"},
          {role: "copy"},
          {role: "paste"},
          {role: "pasteandmatchstyle"},
          {role: "delete"},
          {role: "selectall"}
        ]
      },
      {
        label: "Query",
        submenu: [
          {
            label: "Pin Search",
            accelerator: "CmdOrCtrl+K",
            click: () => browserWindow.webContents.send("pinSearch")
          },
          {
            label: "Clear Pins",
            accelerator: "CmdOrCtrl+Shift+K",
            click: () => browserWindow.webContents.send("clearPins")
          },
          {
            label: "Focus Search Bar",
            accelerator: "CmdOrCtrl+L",
            click: () => browserWindow.webContents.send("focusSearchBar")
          }
        ]
      },
      {
        label: "View",
        submenu: [
          {role: "reload"},
          {role: "forcereload"},
          {role: "toggledevtools"},
          {type: "separator"},
          {role: "resetzoom"},
          {role: "zoomin"},
          {role: "zoomout"},
          {type: "separator"},
          {
            label: "Toggle Search History",
            accelerator: "CmdOrCtrl+[",
            click: () => browserWindow.webContents.send("toggleLeftSidebar")
          },
          {
            label: "Toggle Log Details",
            accelerator: "CmdOrCtrl+]",
            click: () => browserWindow.webContents.send("toggleRightSidebar")
          },
          {type: "separator"},
          {role: "togglefullscreen"}
        ]
      },
      {
        role: "window",
        submenu: [
          {role: "minimize"},
          {role: "close"},
          {
            label: "Reset State",
            click: () => browserWindow.webContents.send("resetState")
          }
        ]
      },
      {
        role: "help",
        submenu: [
          {
            label: "Learn More",
            click() {
              require("electron").shell.openExternal("https://electronjs.org")
            }
          }
        ]
      }
    ]

    if (process.platform === "darwin") {
      template.unshift({
        label: app.getName(),
        submenu: [
          {role: "about"},
          {type: "separator"},
          {role: "services", submenu: []},
          {type: "separator"},
          {role: "hide"},
          {role: "hideothers"},
          {role: "unhide"},
          {type: "separator"},
          {role: "quit"}
        ]
      })

      // Edit menu
      template[1].submenu.push(
        {type: "separator"},
        {
          label: "Speech",
          submenu: [{role: "startspeaking"}, {role: "stopspeaking"}]
        }
      )

      // Window menu
      template[4].submenu.concat([
        {role: "close"},
        {role: "minimize"},
        {role: "zoom"},
        {type: "separator"},
        {role: "front"}
      ])
    }
    return Menu.buildFromTemplate(template)
  }
}
