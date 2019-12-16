/* @flow */

import opn from "opn"

import {remote} from "electron"

import downloads from "./downloadsDir"

export const open = (path: string) => {
  return opn(path)
}

export const downloadsDir = () => {
  return downloads()
}

export function showContextMenu(template: Object) {
  new remote.Menu.buildFromTemplate(template).popup()
}
