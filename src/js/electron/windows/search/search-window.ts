import {nanoid} from "@reduxjs/toolkit"
import {Menu, BrowserWindowConstructorOptions, ipcMain} from "electron"
import env from "src/app/core/env"
import {WindowName} from "../types"
import {ZuiWindow} from "../zui-window"
import {createMenu, SearchAppMenuState} from "./app-menu"

export class SearchWindow extends ZuiWindow {
  name: WindowName = "search"
  options: BrowserWindowConstructorOptions = {
    titleBarStyle: env.isMac ? "hidden" : undefined,
    trafficLightPosition: {x: 16, y: 13},
    resizable: true,
    minWidth: 480,
    minHeight: 100,
    width: 1250,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
      contextIsolation: false,
    },
  }

  updateAppMenu(state: SearchAppMenuState) {
    Menu.setApplicationMenu(createMenu(this, state))
  }

  onFocus(): void {
    this.send("updateSearchAppMenu")
  }

  async onClose(e: Electron.Event) {
    e.preventDefault()
    if (await this.confirmClose()) {
      await this.prepareClose()
      this.close()
    }
  }

  async confirmClose() {
    const replyChannel = nanoid()
    return new Promise<boolean>((resolve) => {
      this.ref.webContents.send("confirmClose", replyChannel)
      ipcMain.once(replyChannel, (e, confirmed: boolean) => resolve(confirmed))
    })
  }

  async prepareClose() {
    const replyChannel = nanoid()
    return new Promise<void>((resolve) => {
      this.ref.webContents.send("prepareClose", replyChannel)
      ipcMain.once(replyChannel, () => resolve())
    })
  }
}
