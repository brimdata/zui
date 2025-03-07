import {app, MenuItemConstructorOptions, shell, Menu} from "electron"
import env from "src/core/env"
import links from "src/config/links"
import pkg from "src/electron/pkg"
import {closeWindowOp} from "../../ops/close-window-op"
import {moveToCurrentDisplayOp} from "../../ops/move-to-current-display-op"
import {openAboutWindowOp} from "../../ops/open-about-window-op"
import {openSearchWindowOp} from "../../ops/open-search-window-op"
import {resetStateOp} from "../../ops/reset-state-op"
import {showPreferencesOp} from "../../ops/show-preferences-op"
import {showReleaseNotesOp} from "../../ops/show-release-notes-op"
import {SearchWindow} from "./search-window"
import {sendToFocusedWindow} from "src/core/ipc"
import {open as openUpdateWindow} from "src/domain/updates/operations"
import {paste} from "src/domain/loads/operations"

export const defaultAppMenuState = () => ({
  showRightPane: true,
  showLeftPane: true,
  showHistogram: true,
  routeName: null as null | string,
})

export type SearchAppMenuState = ReturnType<typeof defaultAppMenuState>

export function compileTemplate(
  window: SearchWindow,
  state: SearchAppMenuState = defaultAppMenuState()
) {
  const mac = env.isMac
  const querySessionActive = state.routeName === "querySession"
  const __: MenuItemConstructorOptions = {type: "separator"}

  const newWindow: MenuItemConstructorOptions = {
    label: "New Window",
    accelerator: "CmdOrCtrl+N",
    click: () => openSearchWindowOp(),
  }

  const exit: MenuItemConstructorOptions = {
    label: "Exit",
    click: () => app.quit(),
  }

  const aboutApp: MenuItemConstructorOptions = {
    label: `About ${app.getName()}`,
    click() {
      openAboutWindowOp()
    },
  }

  const closeWindow: MenuItemConstructorOptions = {
    label: "Close Window",
    click: () => closeWindowOp(),
  }

  const closeTab: MenuItemConstructorOptions = {
    label: "Close Tab",
    click: () => window.send("closeTab"),
  }

  const settings: MenuItemConstructorOptions = {
    id: "preferences",
    label: "Settings...",
    click: () => showPreferencesOp(),
  }

  const resetState: MenuItemConstructorOptions = {
    label: "Reset State",
    click: () => resetStateOp(),
  }

  const exportResults: MenuItemConstructorOptions = {
    label: "Export Results As...",
    accelerator: "CmdOrCtrl+Shift+E",
    click: () => window.send("showExportResults"),
    enabled: querySessionActive,
  }

  const checkForUpdates: MenuItemConstructorOptions = {
    id: "check-for-updates",
    label: "Check For Updates...",
    click: () => openUpdateWindow(),
  }

  const openFile: MenuItemConstructorOptions = {
    label: "Open Data File...",
    click: () => sendToFocusedWindow("loads.chooseFiles"),
    accelerator: "CmdOrCtrl+O",
  }

  const pasteData: MenuItemConstructorOptions = {
    label: "Paste Data...",
    click: paste,
    accelerator: "CmdOrCtrl+Shift+V",
  }

  const appNameMenu: MenuItemConstructorOptions = {
    label: app.getName(),
    submenu: [
      aboutApp,
      checkForUpdates,
      __,
      settings,
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
      return [
        newWindow,
        __,
        openFile,
        pasteData,
        exportResults,
        __,
        closeTab,
        closeWindow,
      ]
    } else {
      return [
        newWindow,
        __,
        openFile,
        pasteData,
        exportResults,
        __,
        settings,
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
          click: () => moveToCurrentDisplayOp(),
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
        click: () => sendToFocusedWindow("session.createPinFromEditor"),
      },
      {
        label: "Clear Pins",
        accelerator: "CmdOrCtrl+Shift+K",
        click: () => window.send("clearPins"),
      },
      {
        label: "Focus Editor",
        accelerator: "CmdOrCtrl+L",
        click: () => sendToFocusedWindow("session.focusEditor"),
      },
      __,
      {
        label: "Back",
        accelerator: "CmdOrCtrl+Left",
        click: () => window.send("back"),
      },
      {
        label: "Forward",
        accelerator: "CmdOrCtrl+Right",
        click: () => window.send("forward"),
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
        label: "Show Left Pane",
        accelerator: "CmdOrCtrl+[",
        click: () => window.send("toggleLeftSidebar"),
        type: "checkbox",
        checked: state.showLeftPane,
      },
      {
        label: "Show Right Pane",
        accelerator: "CmdOrCtrl+]",
        click: () => window.send("toggleRightSidebar"),
        type: "checkbox",
        checked: state.showRightPane,
      },
      {
        label: "Show Histogram",
        click: () => window.send("results.toggleHistogram"),
        type: "checkbox",
        checked: state.showHistogram,
      },
      __,
      {role: "togglefullscreen"},
    ]
  }

  function helpSubmenu() {
    const submenu: MenuItemConstructorOptions[] = [
      {
        label: "Welcome",
        click: () => sendToFocusedWindow("window.showWelcomePage"),
      },
      {
        label: "Zui Documentation",
        click() {
          shell.openExternal(links.DESKTOP_DOCS_ROOT)
        },
      },
      {
        label: "Zed Language Documentation",
        click() {
          shell.openExternal(links.DOCS_LANGUAGE)
        },
      },

      {
        label: "Show Release Notes",
        click() {
          showReleaseNotesOp()
        },
      },
      __,
      {
        label: "Slack Support Channel",
        click() {
          shell.openExternal("https://www.brimdata.io/join-slack/")
        },
      },
      {
        label: "Github Repository",
        click() {
          shell.openExternal(pkg.repository)
        },
      },
      {
        label: "Report Issue",
        click() {
          shell.openExternal(
            "https://zui.brimdata.io/docs/support/Troubleshooting#opening-an-issue"
          )
        },
      },
    ]

    if (!mac) {
      submenu.push(__, checkForUpdates, __, aboutApp)
    }
    return submenu
  }

  const template: MenuItemConstructorOptions[] = [
    {label: "File", submenu: fileSubmenu()},
    {label: "Edit", submenu: editSubmenu()},
    {label: "Query", submenu: querySubmenu()},
    {label: "View", submenu: viewSubmenu()},
    {role: "window", submenu: windowSubmenu()},
    {role: "help", submenu: helpSubmenu()},
  ]
  if (mac) template.unshift(appNameMenu)
  return template
}

export function createMenu(win: SearchWindow, state: SearchAppMenuState) {
  return Menu.buildFromTemplate(compileTemplate(win, state))
}
