/* @noflow */

import type {$WindowManager} from "../tron/windowManager"
import config from "../config"
import lib from "../../lib"

export default function searchAppMenu(send: Function, manager: $WindowManager) {
  let template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Window",
          accelerator: "CmdOrCtrl+N",
          click: () => manager.openWindow("search", {})
        }
      ]
    },
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
          click: () => send("pinSearch")
        },
        {
          label: "Clear Pins",
          accelerator: "CmdOrCtrl+Shift+K",
          click: () => send("clearPins")
        },
        {
          label: "Focus Search Bar",
          accelerator: "CmdOrCtrl+L",
          click: () => send("focusSearchBar")
        },
        {type: "separator"},
        {
          label: "Back",
          accelerator: "CmdOrCtrl+Left",
          click: () => send("back")
        },
        {
          label: "Forward",
          accelerator: "CmdOrCtrl+Right",
          click: () => send("forward")
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
          click: () => send("toggleLeftSidebar")
        },
        {
          label: "Toggle Log Details",
          accelerator: "CmdOrCtrl+]",
          click: () => send("toggleRightSidebar")
        },
        {type: "separator"},
        {role: "togglefullscreen"}
      ]
    },
    {
      role: "window",
      submenu: [
        {role: "minimize"},
        {
          label: "Reset State",
          click: () => {
            send("resetState")
            lib
              .file(config.windowStateFile())
              .remove()
              .catch(() => {})
          }
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
      label: "Brim",
      submenu: [
        {
          label: "About",
          click() {
            send("showAbout")
          }
        },
        {type: "separator"},
        {
          label: "Preferences...",
          click() {
            send("showPreferences")
          }
        },
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
    template[3].submenu.push(
      {type: "separator"},
      {
        label: "Speech",
        submenu: [{role: "startspeaking"}, {role: "stopspeaking"}]
      }
    )

    // Window menu
    template[6].submenu.concat([
      {role: "close"},
      {role: "minimize"},
      {role: "zoom"},
      {type: "separator"},
      {role: "front"}
    ])
  }

  return template
}
