import {sendToFocusedWindow} from "src/core/ipc"
import {MenuItem} from "src/core/menu"

export class MenusApi {
  extensions = []

  extend(id: string, callback: (items: MenuItem[]) => void) {
    this.extensions.push({id, callback})
  }

  updateItem(menuId: string, itemId: string, update: Partial<MenuItem>) {
    sendToFocusedWindow("menus.update", menuId, itemId, update)
  }
}
