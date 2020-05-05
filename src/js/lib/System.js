/* @flow */

import {remote} from "electron"

export function showContextMenu(template: Object) {
  if (process.env.BRIM_ITEST === "true") {
    document.dispatchEvent(
      new CustomEvent("nativeContextMenu", {detail: template})
    )
  } else {
    new remote.Menu.buildFromTemplate(template).popup()
  }
}
