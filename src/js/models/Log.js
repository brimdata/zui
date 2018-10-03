/* @flow */

import isEqual from "lodash/isEqual"

type Tuple = string[]

type Field = {
  type: string,
  name: string,
  value: string
}

type Descriptor = {type: string, name: string}[]

export default class Log {
  tuple: Tuple
  descriptor: Descriptor

  static buildAll(
    tuples: Tuple[],
    descriptors: {[string]: Descriptor},
    space: string
  ) {
    const logs = []
    tuples.forEach(tuple => {
      const descriptor = descriptors[space + "." + tuple[0]]
      if (descriptor) logs.push(new Log(tuple, descriptor))
    })
    return logs
  }

  static isSame(a: Log, b: Log) {
    if (!a || !b) return false
    return isEqual(a.tuple, b.tuple) && isEqual(a.descriptor, b.descriptor)
  }

  constructor(tuple: Tuple, descriptor: Descriptor) {
    this.tuple = tuple
    this.descriptor = descriptor
  }

  getIndex(name: string) {
    return this.descriptor.findIndex(field => field.name === name)
  }

  get(name: string) {
    return this.tuple[this.getIndex(name)]
  }

  getField(fieldName: string): Field {
    return this.getFieldAt(this.getIndex(fieldName))
  }

  getFieldAt(index: number): Field {
    if (index !== -1 && index < this.tuple.length) {
      const value = this.tuple[index]
      const {name, type} = this.descriptor[index]
      return {value, name, type}
    } else {
      throw new Error(`No field at index ${index}`)
    }
  }

  getSec(fieldName: string): number {
    const {name, type, value} = this.getField(fieldName)
    if (type === "time" || type === "interval") {
      return parseInt(value.split(".")[0])
    } else {
      throw new Error(`${name} is not a time type`)
    }
  }

  getNs(fieldName: string): number {
    const {name, type, value} = this.getField(fieldName)
    if (type === "time" || type === "interval") {
      return parseInt(value.split(".")[1] + "000")
    } else {
      throw new Error(`${name} is not a time type`)
    }
  }

  cast(name: string) {
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
