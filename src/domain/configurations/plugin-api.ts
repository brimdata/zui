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
  list: Config[] = []

  get all() {
    return this.list
  }

  create(config: Config) {
    this.list.push(config)
  }
}
