import ConfigPropValues from "src/js/state/ConfigPropValues"
import {AppDispatch, State} from "src/js/state/types"

export type ConfigItemType = "file" | "string" | "directory" | "boolean" // | "number" | "boolean"

export type ConfigItem = {
  name: string
  type: ConfigItemType
  label: string
  helpLink?: {
    label: string
    url: string
  }
  command?: string
  defaultValue?: string | boolean
  enum?: string[]
}

export type Config = {
  name: string
  title: string
  properties: {[configItemName: string]: ConfigItem}
}

export class ConfigurationsApi {
  configs: Config[] = []

  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  get all() {
    return this.configs
  }
  k
  get(configName, propName): any {
    return ConfigPropValues.get(configName, propName)(this.getState())
  }

  add(config: Config) {
    this.configs.push(config)
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
