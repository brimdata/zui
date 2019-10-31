/* @flow */
import {BrowserWindow, ipcRenderer, MenuItem} from "electron"

import type {Dispatch} from "../../state/types"

type Props = {
  name: string,
  label: string,
  listener: Function
}

type Options = {
  enabled: boolean
}

export default function action({name, label, listener}: Props) {
  return {
    // To be called anywhere we need to build menus
    menuItem(args: *[], options?: Options) {
      return {
        label,
        ...options,
        click(menuItem: MenuItem, win: BrowserWindow) {
          win.webContents.send(name, ...args)
        }
      }
    },
    // To be called in the render process
    listen(dispatch: Dispatch) {
      return ipcRenderer.on(name, (e, ...args) => listener(dispatch, ...args))
    }
  }
}
