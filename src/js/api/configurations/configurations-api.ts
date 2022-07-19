import ConfigPropValues from "src/js/state/ConfigPropValues"
import Configs, {Config} from "src/js/state/Configs"
import {AppDispatch, State} from "src/js/state/types"

export class ConfigurationsApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  get(configName, propName): any {
    return ConfigPropValues.get(configName, propName)(this.getState())
  }

  add(config: Config) {
    this.dispatch(Configs.set(config))
    // Set default values if there are any unset values
    for (let name in config.properties) {
      const prop = config.properties[name]
      const exists = this.get(config.name, name)
      if (exists === undefined && "defaultValue" in prop) {
        this.dispatch(
          ConfigPropValues.set({
            configName: config.name,
            propName: name,
            value: prop.defaultValue,
          })
        )
      }
    }
  }
}
