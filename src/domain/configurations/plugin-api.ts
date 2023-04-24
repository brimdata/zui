import ConfigPropValues from "src/js/state/ConfigPropValues"
import {Store} from "src/js/state/types"

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
  store: Store
  list: Config[] = []

  get all() {
    return this.list
  }

  get(namespace: string, name: string): any {
    return ConfigPropValues.get(namespace, name)(this.store.getState())
  }

  create(config: Config) {
    this.list.push(config)
  }
}
