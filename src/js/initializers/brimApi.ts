import Toolbar, {ToolbarItem} from "../state/Toolbars"
import {Store} from "../state/types"
import EventEmitter from "events"

type Cleanup = () => any

class CommandRegistry {
  private commandRegistry = new EventEmitter()

  constructor() {}

  add(command: string, listener: (...args: any[]) => void): Cleanup {
    this.commandRegistry.on(command, listener)

    return () => this.commandRegistry.removeListener(command, listener)
  }

  execute(command: string, ...args: any[]): boolean {
    return this.commandRegistry.emit(command, ...args)
  }

  list(): string[] {
    return this.commandRegistry.eventNames() as string[]
  }
}

interface BrimUIContainerApi<ItemType> {
  add: (containerId: string, item: ItemType) => void
  update: (containerId: string, itemId: string, type: Partial<ItemType>) => void
}

class ToolbarApi implements BrimUIContainerApi<ToolbarItem> {
  constructor(private store: Store) {}

  add(toolbarId: string, item: ToolbarItem) {
    this.store.dispatch(Toolbar.createItem({toolbarId, item}))
  }

  update(toolbarId: string, itemId: string, item: ToolbarItem) {
    this.store.dispatch(Toolbar.updateItem({toolbarId, itemId, item}))
  }
}

// class ContextMenuApi implements BrimUIContainerApi<ContextMenuItem> {
//   constructor(private store: Store) {}
//
//   add() {}
//
//   update() {}
// }

export default class BrimApi {
  public commands = new CommandRegistry()
  public toolbar: BrimUIContainerApi<ToolbarItem>

  // public contextMenu: BrimUIContainerApi<ContextMenuItem>

  constructor(private store: Store) {
    this.toolbar = new ToolbarApi(store)
    // this.contextMenu = new ContextMenuApi(store)
  }
}
