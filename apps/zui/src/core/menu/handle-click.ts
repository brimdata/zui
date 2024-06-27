import {invoke} from "../invoke"
import {showMenu} from "./show-context-menu"
import {MenuItem} from "./types"

export function handleClick(item: MenuItem, anchor?: HTMLElement) {
  if (item.command) {
    const name = item.command
    const args = item.args || []
    invoke("commands.run", name, ...args)
  } else if (item.click) {
    item.click()
  } else if (item.nestedMenu) {
    showMenu(item.nestedMenu, anchor)
  }
}
