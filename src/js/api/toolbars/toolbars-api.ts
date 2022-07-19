import {AppDispatch, State} from "src/js/state/types"
import Toolbar, {ToolbarItem} from "src/js/state/Toolbars"

export class ToolbarsApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  add(toolbarId: string, item: ToolbarItem) {
    this.dispatch(Toolbar.createItem({toolbarId, item}))
  }

  update(toolbarId: string, itemId: string, item: Partial<ToolbarItem>) {
    this.dispatch(Toolbar.updateItem({toolbarId, itemId, item}))
  }
}
