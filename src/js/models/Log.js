/* @flow */

import FieldFactory from "./FieldFactory"
import isEqual from "lodash/isEqual"

export type Tuple = string[]
export type Descriptor = {type: string, name: string}[]

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
    return isEqual(a.tuple, b.tuple)
  }

  isPath(pathName: string) {
    return this.get("_path") === pathName
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

  getField(fieldName: string) {
    return this.getFieldAt(this.getIndex(fieldName))
  }

  getFieldAt(index: number) {
    if (index !== -1 && index < this.tuple.length) {
      const value = this.tuple[index]
      const {name, type} = this.descriptor[index]
      return FieldFactory.create({value, name, type})
    }
  }

  getSec(fieldName: string): number | void {
    const field = this.getField(fieldName)
    if (field) {
      const {type, name, value} = field
      if (type === "time" || type === "interval") {
        return parseInt(value.split(".")[0])
      } else {
        throw new Error(`${name} is not a time type`)
      }
    }
  }

  getNs(fieldName: string): number | void {
    const field = this.getField(fieldName)
    if (field) {
      const {name, type, value} = field
      if (type === "time" || type === "interval") {
        return parseInt(value.split(".")[1] + "000")
      } else {
        throw new Error(`${name} is not a time type`)
      }
    }
  }

  cast(name: string) {
    const field = this.getField(name)
    if (field) {
      return field.cast()
    }
  }

  correlationId() {
    if (this.get("_path") === "files") {
      return this.get("conn_uids")
    } else {
      return this.get("uid")
    }
  }
}
