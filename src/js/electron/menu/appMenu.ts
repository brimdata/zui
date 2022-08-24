import {app, dialog, shell, MenuItemConstructorOptions} from "electron"
import path from "path"

import electronIsDev from "../isDev"
import {encodeSessionState} from "../session-state"
import {BrimMain} from "../brim"
import env from "src/app/core/env"
import links from "src/app/core/links"
import {showReleaseNotesOp} from "../ops/show-release-notes-op"
import {closeWindowOp} from "../ops/close-window-op"
import {showPreferencesOp} from "../ops/show-preferences-op"
import {openAboutWindowOp} from "../ops/open-about-window-op"
import {moveToCurrentDisplayOp} from "../ops/move-to-current-display-op"

export default function (
  send: Function,
  brim: BrimMain
): MenuItemConstructorOptions[] {
  const mac = env.isMac
  const __: MenuItemConstructorOptions = {type: "separator"}

  const newWindow: MenuItemConstructorOptions = {
    label: "New Window",
    accelerator: "CmdOrCtrl+N",
    click: () => brim.windows.create("search"),
  }

  const exit: MenuItemConstructorOptions = {
    label: "Exit",
    click: () => app.quit(),
  }

  const aboutBrim: MenuItemConstructorOptions = {
    label: `About ${app.getName()}`,
    click() {
      openAboutWindowOp.run()
    },
  }

  const closeWindow: MenuItemConstructorOptions = {
    label: "Close Window",
    click: () => closeWindowOp.run(),
  }

  const closeTab: MenuItemConstructorOptions = {
    label: "Close Tab",
    click: () => send("closeTab"),
  }

  const preferences: MenuItemConstructorOptions = {
    id: "preferences",
    label: env.isMac ? "Preferences..." : "Settings",
    click: () => showPreferencesOp.run(),
  }

  const resetState: MenuItemConstructorOptions = {
    label: "Reset State",
    click: async () => {
      const {response} = await dialog.showMessageBox({
        message: "Are you sure?",
        detail: "This will reset local app state but retain lake data.",
        buttons: ["OK", "Cancel"],
      })
      if (response === 0) await brim.resetState()
    },
  }

  const exportResults: MenuItemConstructorOptions = {
    label: "Export Results As...",
    click: () => send("showExportResults"),
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
      {role: "quit"},
    ],
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
        exit,
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
      {role: "selectAll"},
    ]
    if (mac) {
      submenu.push(__, {
        label: "Speech",
        submenu: [{role: "startSpeaking"}, {role: "stopSpeaking"}],
      })
    }
    return submenu
  }

  function windowSubmenu(): MenuItemConstructorOptions[] {
    const submenu = [
      {role: "minimize"} as MenuItemConstructorOptions,
      __,
      resetState,
      __,
    ]
    if (mac) {
      submenu.push(
        __,
        {role: "close"},
        {role: "zoom"},
        __,
        {
          role: "front",
        },
        {
          label: "Organize Windows",
          click: () => moveToCurrentDisplayOp.run(),
        }
      )
    }
    submenu.push()
    return submenu
  }

  function querySubmenu() {
    return [
      {
        label: "Pin Search",
        accelerator: "CmdOrCtrl+K",
        click: () => send("pinSearch"),
      },
      {
        label: "Clear Pins",
        accelerator: "CmdOrCtrl+Shift+K",
        click: () => send("clearPins"),
      },
      {
        label: "Focus Search Bar",
        accelerator: "CmdOrCtrl+L",
        click: () => send("focusSearchBar"),
      },
      __,
      {
        label: "Back",
        accelerator: "CmdOrCtrl+Left",
        click: () => send("back"),
      },
      {
        label: "Forward",
        accelerator: "CmdOrCtrl+Right",
        click: () => send("forward"),
      },
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
        id: "toggle-left-pane",
        label: "Toggle Left Pane",
        accelerator: "CmdOrCtrl+[",
        click: () => send("toggleLeftSidebar"),
      },
      {
        id: "toggle-right-pane",
        label: "Toggle Right Pane",
        accelerator: "CmdOrCtrl+]",
        click: () => send("toggleRightSidebar"),
      },

      __,
      {role: "togglefullscreen"},
    ]
  }

  function helpSubmenu() {
    const submenu: MenuItemConstructorOptions[] = [
      {
        label: "Release Notes",
        click() {
          showReleaseNotesOp.run()
        },
      },
      {
        label: "Zed Syntax Docs",
        click() {
          shell.openExternal(links.ZED_DOCS_LANGUAGE)
        },
      },
      {
        label: "Slack Support Channel",
        click() {
          shell.openExternal("https://www.brimdata.io/join-slack/")
        },
      },
      {
        label: "Github Repository",
        click() {
          shell.openExternal("https://github.com/brimdata/brim")
        },
      },
      {
        label: "Submit Issue...",
        click() {
          shell.openExternal(
            "https://github.com/brimdata/brim/wiki/Troubleshooting#opening-an-issue"
          )
        },
      },
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
        label: "Save Session Now",
        async click() {
          await brim.saveSession()
        },
      },
      {
        label: "Save Session for Testing Migrations",
        async click() {
          const root = app.getAppPath()
          const version = brim.session.getVersion()
          const file = path.join(root, `src/test/unit/states/${version}.json`)
          const data = encodeSessionState(
            await brim.windows.serialize(),
            brim.store.getState()
          )
          await brim.session.save(data, file)
          dialog.showMessageBox({
            message: `Session has been saved`,
            detail: file,
          })
        },
      },
    ],
  }

  const template: MenuItemConstructorOptions[] = [
    {label: "File", submenu: fileSubmenu()},
    {label: "Edit", submenu: editSubmenu()},
    {label: "Query", submenu: querySubmenu()},
    {label: "View", submenu: viewSubmenu()},
    {role: "window", submenu: windowSubmenu()},
    {role: "help", submenu: helpSubmenu()},
  ]
  if (mac) template.unshift(brimMenu)
  if (electronIsDev) template.push(developerMenu)
  return template
}
