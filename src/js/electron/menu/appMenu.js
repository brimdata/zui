/* @noflow */

import {shell} from "electron"

import type {$WindowManager} from "../tron/windowManager"
import config from "../config"
import lib from "../../lib"

export default function appMenu(
  send: Function,
  manager: $WindowManager,
  platform: string = process.platform
) {
  const mac = platform === "darwin"

  const newWindow = {
    label: "New Window",
    accelerator: "CmdOrCtrl+N",
    click: () => manager.openWindow("search", {})
  }

  const aboutBrim = {
    label: "About Brim",
    click() {
      manager.openAbout()
    }
  }

  const preferences = {
    label: platform === "darwin" ? "Preferences" : "Settings",
    click() {
      send("showPreferences")
    }
  }

  const resetState = {
    label: "Reset State",
    click: () => {
      send("resetState")
      lib
        .file(config.windowStateFile())
        .remove()
        .catch(() => {})
    }
  }

  const brimMenu = {
    label: "Brim",
    submenu: [
      aboutBrim,
      {type: "separator"},
      preferences,
      {role: "services", submenu: []},
      {type: "separator"},
      {role: "hide"},
      {role: "hideothers"},
      {role: "unhide"},
      {type: "separator"},
      {role: "quit"}
    ]
  }

  function fileSubmenu() {
    let submenu = [newWindow]
    if (!mac) {
      submenu.push({type: "separator"}, preferences)
    }
    return submenu
  }

  function editSubmenu() {
    let submenu = [
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
    if (mac) {
      submenu.push(
        {type: "separator"},
        {
          label: "Speech",
          submenu: [{role: "startspeaking"}, {role: "stopspeaking"}]
        }
      )
    }
    return submenu
  }

  function windowSubmenu() {
    let submenu = [{role: "minimize"}, resetState]
    if (mac) {
      submenu.push(
        {role: "close"},
        {role: "minimize"},
        {role: "zoom"},
        {type: "separator"},
        {role: "front"}
      )
    }
    return submenu
  }

  function querySubmenu() {
    return [
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
  }

  function viewSubmenu() {
    return [
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
  }

  function helpSubmenu() {
    let submenu = [
      {
        label: "Slack Support Channel",
        click() {
          shell.openExternal(
            "https://join.slack.com/t/brimsec/shared_invite/zt-cy34xoxg-hZiTKUT~1KdGjlaBIuUUdg"
          )
        }
      },
      {
        label: "Github Repository",
        click() {
          shell.openExternal("https://github.com/brimsec/brim")
        }
      },
      {
        label: "Submit Issue...",
        click() {
          shell.openExternal("https://github.com/brimsec/brim/issues/new")
        }
      }
    ]

    if (!mac) {
      submenu.push({type: "separator"}, aboutBrim)
    }
    return submenu
  }

  let template = [
    {label: "File", submenu: fileSubmenu()},
    {label: "Edit", submenu: editSubmenu()},
    {label: "Query", submenu: querySubmenu()},
    {label: "View", submenu: viewSubmenu()},
    {role: "window", submenu: windowSubmenu()},
    {role: "help", submenu: helpSubmenu()}
  ]
  if (mac) template.unshift(brimMenu)
  return template
}
