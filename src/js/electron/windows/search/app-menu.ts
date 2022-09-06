import {app, MenuItemConstructorOptions, shell, Menu} from "electron"
import {showWelcomePage} from "src/app/commands/show-welcome-page"
import env from "src/app/core/env"
import links from "src/app/core/links"
import {closeWindowOp} from "../../ops/close-window-op"
import {moveToCurrentDisplayOp} from "../../ops/move-to-current-display-op"
import {openAboutWindowOp} from "../../ops/open-about-window-op"
import {openSearchWindowOp} from "../../ops/open-search-window-op"
import {resetStateOp} from "../../ops/reset-state-op"
import {runCommandOp} from "../../ops/run-command-op"
import {showPreferencesOp} from "../../ops/show-preferences-op"
import {showReleaseNotesOp} from "../../ops/show-release-notes-op"
import {SearchWindow} from "./search-window"

export const defaultAppMenuState = () => ({
  showRightPane: true,
  showLeftPane: true,
  showHistogram: true,
})

export type SearchAppMenuState = ReturnType<typeof defaultAppMenuState>

export function compileTemplate(
  window: SearchWindow,
  state: SearchAppMenuState = defaultAppMenuState()
) {
  const mac = env.isMac
  const __: MenuItemConstructorOptions = {type: "separator"}

  const newWindow: MenuItemConstructorOptions = {
    label: "New Window",
    accelerator: "CmdOrCtrl+N",
    click: () => openSearchWindowOp.run(),
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
    click: () => window.send("closeTab"),
  }

  const preferences: MenuItemConstructorOptions = {
    id: "preferences",
    label: env.isMac ? "Preferences..." : "Settings",
    click: () => showPreferencesOp.run(),
  }

  const resetState: MenuItemConstructorOptions = {
    label: "Reset State",
    click: () => resetStateOp.run(),
  }

  const exportResults: MenuItemConstructorOptions = {
    label: "Export Results As...",
    click: () => window.send("showExportResults"),
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
        click: () => window.send("pinSearch"),
      },
      {
        label: "Clear Pins",
        accelerator: "CmdOrCtrl+Shift+K",
        click: () => window.send("clearPins"),
      },
      {
        label: "Focus Search Bar",
        accelerator: "CmdOrCtrl+L",
        click: () => window.send("focusSearchBar"),
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
        click: () => window.send("toggleHistogram"),
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
        label: "Release Notes",
        click() {
          showReleaseNotesOp.run()
        },
      },
      {
        label: "Show Welcome Page",
        click: () => runCommandOp.run(showWelcomePage),
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

  const template: MenuItemConstructorOptions[] = [
    {label: "File", submenu: fileSubmenu()},
    {label: "Edit", submenu: editSubmenu()},
    {label: "Query", submenu: querySubmenu()},
    {label: "View", submenu: viewSubmenu()},
    {role: "window", submenu: windowSubmenu()},
    {role: "help", submenu: helpSubmenu()},
  ]
  if (mac) template.unshift(brimMenu)
  return template
}

export function createMenu(win: SearchWindow, state: SearchAppMenuState) {
  return Menu.buildFromTemplate(compileTemplate(win, state))
}
