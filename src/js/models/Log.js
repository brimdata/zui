import isEqual from "lodash/isEqual"

class Log {
  static buildAll(tuples, descriptors, space) {
    const logs = []
    for (let index in tuples) {
      const tuple = tuples[index]
      const descriptor = descriptors[space + "." + tuple[0]]
      if (descriptor) logs.push(new Log(tuple, descriptor))
    }
    return logs
  }

  constructor(tuple, descriptor) {
    this.tuple = tuple
    this.descriptor = descriptor
  }

  getIndex(name) {
    return this.descriptor.findIndex(field => field.name === name)
  }

  get(name) {
    return this.tuple[this.getIndex(name)]
  }

  getField(fieldName) {
    return this.getFieldAt(this.getIndex(fieldName))
  }

  getFieldAt(index) {
    if (index !== -1) {
      const value = this.tuple[index]
      const {name, type} = this.descriptor[index]
      return {value, name, type}
    } else {
      return null
    }
  }

  cast(name) {
    const field = this.getField(name)
    if (!field) return null

    const {value, type} = field

    if (value === "-") return null

    switch (type) {
      case "time":
        return new Date(+value * 1000)
      case "interval":
        return parseFloat(value)
      case "string":
      case "addr":
      case "port":
      case "enum":
      case "count":
      case "bool":
      case "set[string]":
      default:
        return value
    }
  }
}

Log.isSame = (a, b) => {
  if (!a || a.constructor !== Log) return false
  if (!b || b.constructor !== Log) return false
  return isEqual(a.tuple, b.tuple) && isEqual(a.descriptor, b.descriptor)
}

export default Log
