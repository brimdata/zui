import {AppDispatch, State} from "../state/types"
import Toolbar, {ToolbarItem} from "../state/Toolbars"

export interface BrimUIContainerApi<ItemType> {
  setStoreArgs: (d: AppDispatch, gs: () => State) => void
  add: (containerId: string, item: ItemType) => void
  update: (containerId: string, itemId: string, type: Partial<ItemType>) => void
}

export class ToolbarApi implements BrimUIContainerApi<ToolbarItem> {
  private dispatch: AppDispatch
  private getState: () => State

  constructor() {}

  public setStoreArgs(d: AppDispatch, gs: () => State) {
    this.dispatch = d
    this.getState = gs
  }

  public add(toolbarId: string, item: ToolbarItem) {
    this.dispatch(Toolbar.createItem({toolbarId, item}))
  }

  public update(toolbarId: string, itemId: string, item: Partial<ToolbarItem>) {
    this.dispatch(Toolbar.updateItem({toolbarId, itemId, item}))
  }
}

// export class ContextMenuApi implements BrimUIContainerApi<ContextMenuItem> {
//   constructor(private store: Store) {}
//
//   add() {}
//
//   update() {}
// }
