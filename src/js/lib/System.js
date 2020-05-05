/* @flow */

import {remote} from "electron"

let test = true

export function showContextMenu(template: Object) {
  if (test) {
    document.dispatchEvent(
      new CustomEvent("nativeContextMenu", {detail: template})
    )
  } else {
    new remote.Menu.buildFromTemplate(template).popup()
  }
}
