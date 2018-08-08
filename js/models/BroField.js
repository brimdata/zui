import moment from "moment"
import config from "../config"

export default class BroField {
  constructor({name, type, value}) {
    this.name = name
    this.type = type
    this.value = value
  }

  toString() {
    const typedVal = this.cast()

    switch (typedVal) {
      case undefined:
        return "-"
      case null:
        return "-"
    }

    switch (this.type) {
      case "time":
        return typedVal.format(config.FULL_MOMENT_FORMAT)
      case "interval":
        return typedVal.toLocaleString() + "s"
      default:
        return this.value
    }
  }

  cast() {
    if (this.value === "-") return null

    switch (this.type) {
      case "time":
        return moment.unix(this.value).utc()
      case "interval":
        return parseFloat(this.value)
      case "string":
      case "addr":
      case "port":
      case "enum":
      case "count":
      case "bool":
      case "set[string]":
      default:
        return this.value
    }
  }
}
