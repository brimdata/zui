/* @flow */

import {remote} from "electron"

import downloads from "./downloadsDir"

export const downloadsDir = () => {
  return downloads()
}

export function showContextMenu(template: Object) {
  new remote.Menu.buildFromTemplate(template).popup()
}
