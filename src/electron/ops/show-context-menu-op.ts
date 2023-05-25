import {
  IpcMainInvokeEvent,
  Menu,
  MenuItemConstructorOptions,
  PopupOptions,
} from "electron"
import {createOperation} from "../../core/operations"

export const showContextMenuOp = createOperation(
  "showContextMenuOp",
  (
    {event},
    template: MenuItemConstructorOptions[],
    opts: PopupOptions = {}
  ) => {
    const menu = Menu.buildFromTemplate(injectClickHandlers(template, event))
    menu.popup({
      ...opts,
      callback: () => {
        event.sender.send("contextMenuResult", null)
      },
    })
  }
)

function injectClickHandlers(template, event) {
  return template.map((item) => {
    const fixed = injectClick(item, event)
    if (fixed.submenu) fixed.submenu = injectClickHandlers(item.submenu, event)
    return fixed
  })
}

function injectClick(item, event: IpcMainInvokeEvent) {
  return {
    ...item,
    click: () => {
      event.sender.send("contextMenuResult", item.id || item.label)
    },
  }
}
