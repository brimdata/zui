/* @flow */

import {remote} from "electron"

export function showContextMenu(template: Object) {
  new remote.Menu.buildFromTemplate(template).popup()
}
