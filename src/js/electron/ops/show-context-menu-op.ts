import {Menu, MenuItemConstructorOptions, PopupOptions} from "electron"
import {createOperation} from "../operations"

export const showContextMenuOp = createOperation(
  "showContextMenuOp",
  (_, template: MenuItemConstructorOptions[], opts: PopupOptions = {}) => {
    const menu = Menu.buildFromTemplate(template)
    menu.popup(opts)
  }
)
