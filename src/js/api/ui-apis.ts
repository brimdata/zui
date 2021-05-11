import {AppDispatch, State} from "../state/types"
import Toolbar, {ToolbarItem} from "../state/Toolbars"
import Configs, {Config} from "../state/Configs"

export class ToolbarApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  public add(toolbarId: string, item: ToolbarItem) {
    this.dispatch(Toolbar.createItem({toolbarId, item}))
  }

  public update(toolbarId: string, itemId: string, item: Partial<ToolbarItem>) {
    this.dispatch(Toolbar.updateItem({toolbarId, itemId, item}))
  }
}

export class ConfigsApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  public add(config: Config) {
    this.dispatch(Configs.create(config))
  }

  public updatePropertyDefault(
    configName: string,
    propertyName: string,
    defaultValue: string
  ) {
    this.dispatch(
      Configs.updatePropertyDefault({configName, propertyName, defaultValue})
    )
  }
}
