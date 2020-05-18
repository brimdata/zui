/* @noflow */

import {shell, app, dialog} from "electron"
import path from "path"

import type {$WindowManager} from "../tron/windowManager"
import {type Session} from "../tron"
import config from "../config"
import electronIsDev from "../isDev"
import formatSessionState from "../tron/formatSessionState"
import lib from "../../lib"

export default function appMenu(
  send: Function,
  manager: $WindowManager,
  store: *,
  session: Session,
  platform: string = process.platform
) {
  const mac = platform === "darwin"
  const __ = {type: "separator"}

  const newWindow = {
    label: "New Window",
    accelerator: "CmdOrCtrl+N",
    click: () => manager.openWindow("search", {})
  }

  const exit = {
    label: "Exit",
    click: () => app.quit()
  }

  const aboutBrim = {
    label: "About Brim",
    click() {
      manager.openAbout()
    }
  }

  const closeWindow = {
    label: "Close Window",
    click: () => manager.closeWindow()
  }

  const closeTab = {
    label: "Close Tab",
    click: () => send("closeTab")
  }

  const preferences = {
    label: platform === "darwin" ? "Preferences..." : "Settings",
    click: () => manager.openPreferences()
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
      __,
      preferences,
      {role: "services", submenu: []},
      __,
      {role: "hide"},
      {role: "hideothers"},
      {role: "unhide"},
      __,
      {role: "quit"}
    ]
  }

  function fileSubmenu() {
    if (mac) {
      return [newWindow, __, closeTab, closeWindow]
    } else {
      return [newWindow, __, preferences, __, closeTab, closeWindow, exit]
    }
  }

  function editSubmenu() {
    let submenu = [
      {role: "undo"},
      {role: "redo"},
      __,
      {role: "cut"},
      {role: "copy"},
      {role: "paste"},
      {role: "pasteandmatchstyle"},
      {role: "delete"},
      {role: "selectall"}
    ]
    if (mac) {
      submenu.push(__, {
        label: "Speech",
        submenu: [{role: "startspeaking"}, {role: "stopspeaking"}]
      })
    }
    return submenu
  }

  function windowSubmenu() {
    let submenu = [{role: "minimize"}, resetState]
    if (mac) {
      submenu.push({role: "close"}, {role: "minimize"}, {role: "zoom"}, __, {
        role: "front"
      })
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
      __,
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
      __,
      {role: "resetzoom"},
      {role: "zoomin"},
      {role: "zoomout"},
      __,
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
      __,
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
      submenu.push(__, aboutBrim)
    }
    return submenu
  }

  const developerMenu = {
    label: "Developer",
    submenu: [
      {
        label: "Save Session for Testing Migrations",
        async click() {
          await manager.fetchWindowStates()
          let root = app.getAppPath()
          let version = session.getVersion()
          let file = path.join(root, `src/js/test/states/${version}.json`)
          let data = formatSessionState(manager.getState(), store.getState())
          await session.save(data, file)
          dialog.showMessageBox({
            message: `Session has been saved`,
            detail: file
          })
        }
      }
    ]
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
  if (electronIsDev) template.push(developerMenu)
  return template
}
