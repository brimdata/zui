/* @flow */
import {remote} from "electron"

import type {$Menu} from "../../electron/menu"

const margin = 8

export default function usePopupMenu(template: $Menu) {
  function openMenu(target: HTMLElement) {
    let menu = remote.Menu.buildFromTemplate(template)
    if (target) {
      let {top, left, height} = target.getBoundingClientRect()
      menu.popup({x: left, y: top + height + margin})
    } else {
      menu.popup()
    }
  }

  return openMenu
}
