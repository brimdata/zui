/* @noflow */

import {app, dialog, shell, MenuItemConstructorOptions} from "electron"
import path from "path"

import {$WindowManager} from "../tron/windowManager"
import {Session} from "../tron"
import config from "../config"
import electronIsDev from "../isDev"
import formatSessionState from "../tron/formatSessionState"
import lib from "../../lib"

export default function appMenu(
  send: Function,
  manager: $WindowManager,
  store: any,
  session: Session,
  platform: string = process.platform
): MenuItemConstructorOptions[] {
  const mac = platform === "darwin"
  const __: MenuItemConstructorOptions = {type: "separator"}

  const newWindow: MenuItemConstructorOptions = {
    label: "New Window",
    accelerator: "CmdOrCtrl+N",
    click: () => manager.openWindow("search", {})
  }

  const exit: MenuItemConstructorOptions = {
    label: "Exit",
    click: () => app.quit()
  }

  const aboutBrim: MenuItemConstructorOptions = {
    label: "About Brim",
    click() {
      manager.openAbout()
    }
  }

  const closeWindow: MenuItemConstructorOptions = {
    label: "Close Window",
    click: () => manager.closeWindow()
  }

  const closeTab: MenuItemConstructorOptions = {
    label: "Close Tab",
    click: () => send("closeTab")
  }

  const preferences: MenuItemConstructorOptions = {
    id: "preferences",
    label: platform === "darwin" ? "Preferences..." : "Settings",
    click: () => manager.openPreferences()
  }

  const resetState: MenuItemConstructorOptions = {
    label: "Reset State",
    click: () => {
      send("resetState")
      lib
        .file(config.windowStateFile())
        .remove()
        .catch(() => {})
    }
  }

  const exportResults: MenuItemConstructorOptions = {
    label: "Export Results as ZNG...",
    click: () => send("exportResults")
  }

  const brimMenu: MenuItemConstructorOptions = {
    label: "Brim",
    submenu: [
      aboutBrim,
      __,
      preferences,
      {role: "services", submenu: []},
      __,
      {role: "hide"},
      {role: "hideOthers"},
      {role: "unhide"},
      __,
      {role: "quit"}
    ]
  }

  function fileSubmenu(): MenuItemConstructorOptions[] {
    if (mac) {
      return [newWindow, __, exportResults, __, closeTab, closeWindow]
    } else {
      return [
        newWindow,
        __,
        exportResults,
        __,
        preferences,
        __,
        closeTab,
        closeWindow,
        exit
      ]
    }
  }

  function editSubmenu(): MenuItemConstructorOptions[] {
    const submenu: MenuItemConstructorOptions[] = [
      {role: "undo"},
      {role: "redo"},
      __,
      {role: "cut"},
      {role: "copy"},
      {role: "paste"},
      {role: "pasteAndMatchStyle"},
      {role: "delete"},
      {role: "selectAll"}
    ]
    if (mac) {
      submenu.push(__, {
        label: "Speech",
        submenu: [{role: "startSpeaking"}, {role: "stopSpeaking"}]
      })
    }
    return submenu
  }

  function windowSubmenu(): MenuItemConstructorOptions[] {
    const submenu = [
      {role: "minimize"} as MenuItemConstructorOptions,
      resetState
    ]
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

  function viewSubmenu(): MenuItemConstructorOptions[] {
    return [
      {role: "reload"},
      {role: "forceReload"},
      {role: "toggleDevTools"},
      __,
      {role: "resetZoom"},
      {role: "zoomIn"},
      {role: "zoomOut"},
      __,
      {
        label: "Toggle Left Pane",
        accelerator: "CmdOrCtrl+[",
        click: () => send("toggleLeftSidebar")
      },
      {
        label: "Toggle Right Pane",
        accelerator: "CmdOrCtrl+]",
        click: () => send("toggleRightSidebar")
      },
      __,
      {role: "togglefullscreen"}
    ]
  }

  function helpSubmenu() {
    const submenu: MenuItemConstructorOptions[] = [
      {
        label: "ZQL Syntax Docs",
        click() {
          shell.openExternal(
            "https://github.com/brimsec/zq/tree/master/zql/docs"
          )
        }
      },
      {
        label: "Slack Support Channel",
        click() {
          shell.openExternal("https://www.brimsecurity.com/join-slack/")
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
          shell.openExternal(
            "https://github.com/brimsec/brim/wiki/Troubleshooting#opening-an-issue"
          )
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
          const root = app.getAppPath()
          const version = session.getVersion()
          const file = path.join(root, `src/js/test/states/${version}.json`)
          const data = formatSessionState(manager.getState(), store.getState())
          await session.save(data, file)
          dialog.showMessageBox({
            message: `Session has been saved`,
            detail: file
          })
        }
      }
    ]
  }

  const template: MenuItemConstructorOptions[] = [
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
