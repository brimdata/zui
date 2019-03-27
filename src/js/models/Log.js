/* @flow */

import isEqual from "lodash/isEqual"
import md5 from "md5"

import type {Descriptor, Tuple} from "../types"
import Field from "./Field"
import FieldFactory from "./FieldFactory"

type BuildArgs = {
  tuples: Tuple[],
  descriptor: Descriptor
}

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

  static build({descriptor, tuples}: BuildArgs) {
    return tuples.map<Log>(tuple => new Log(tuple, descriptor))
  }

  static sort(logs: Log[], name: string, dir: "asc" | "desc" = "asc") {
    const direction = dir === "asc" ? 1 : -1

    logs.sort((a, b) =>
      a.get(name) > b.get(name) ? direction : direction * -1
    )

    return logs
  }

  static isSame(a: ?Log, b: ?Log) {
    if (!a || !b) return false
    return isEqual(a.tuple, b.tuple)
  }

  filter(func: Field => boolean) {
    const tuple = []
    const descriptor = []
    this.getFields()
      .filter(func)
      .forEach(({name, value, type}) => {
        tuple.push(value)
        descriptor.push({name, type})
      })
    return new Log(tuple, descriptor)
  }

  exclude(...names: string[]) {
    return this.filter(field => !names.includes(field.name))
  }

  only(...names: string[]) {
    return this.filter(field => names.includes(field.name))
  }

  map(func: *) {
    return this.getFields().map<*>(func)
  }

  id() {
    return md5(this.tuple.join())
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
    } else {
      throw "Index out of bounds"
    }
  }

  getFields(): Field[] {
    const fields = []
    for (let i = 0; i < this.descriptor.length; ++i) {
      const field = this.getFieldAt(i)
      if (field) fields.push(field)
    }
    return fields
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
