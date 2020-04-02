/* @flow */
import {useState} from "react"

import {remote} from "electron"

import type {$Menu} from "../../electron/menu"

const margin = 8

export default function usePopupMenu(template: $Menu) {
  let [isOpen, setIsOpen] = useState(false)

  function open(target: HTMLElement) {
    let menu = remote.Menu.buildFromTemplate(template)
    if (target) {
      let {top, left, height} = target.getBoundingClientRect()
      menu.popup({x: left, y: top + height + margin})
    } else {
      menu.popup()
    }
    setIsOpen(true)
    menu.on("menu-will-close", () => setIsOpen(false))
  }

  return [open, isOpen]
}
