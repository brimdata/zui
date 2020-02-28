/* @flow */

import isEqual from "lodash/isEqual"
import md5 from "md5"

import type {Descriptor, Tuple, TupleSet} from "../types"
import {inBounds} from "../lib/Array"
import {isString} from "../lib/is"
import brim, {type $Field} from "../brim"

type BuildArgs = {
  tuples: Tuple[],
  descriptor: Descriptor
}

export default class Log {
  tuple: Tuple
  descriptor: Descriptor

  static fromTupleSet({tuples, descriptors}: TupleSet) {
    return tuples.map((t) => {
      let [td, ...tuple] = t
      let [_, ...descriptor] = descriptors[td]

      return new Log(tuple, descriptor)
    })
  }

  static buildAll(
    tuples: Tuple[],
    descriptors: {[string]: Descriptor},
    space: string
  ) {
    const logs = []
    tuples.forEach((tuple) => {
      const descriptor = descriptors[space + "." + tuple[0]]
      if (descriptor) logs.push(new Log(tuple, descriptor))
    })
    return logs
  }

  static build({descriptor, tuples}: BuildArgs) {
    return tuples.map<Log>((tuple) => new Log(tuple, descriptor))
  }

  static sort(logs: Log[], name: string, dir: "asc" | "desc" = "asc") {
    const direction = dir === "asc" ? 1 : -1

    logs.sort((a, b) =>
      a.getString(name) > b.getString(name) ? direction : direction * -1
    )

    return logs
  }

  static isSame(a: ?Log, b: ?Log) {
    if (!a || !b) return false
    return isEqual(a.tuple, b.tuple)
  }

  filter(func: ($Field) => boolean) {
    const tuple = []
    const descriptor = []
    this.getFields()
      .filter(func)
      .forEach(({name, value, type}) => {
        tuple.push(value)
        descriptor.push({name, type})
      })
    // $FlowFixMe
    return new Log(tuple, descriptor)
  }

  // Temp duplication while we migrate to using brim.log
  field(name: string): ?$Field {
    let index = this.descriptor.findIndex((d) => d.name === name)
    if (inBounds(this.tuple, index)) {
      let {name, type} = this.descriptor[index]
      let value = this.tuple[index]
      return brim.field({name, type, value})
    } else {
      return null
    }
  }

  exclude(...names: string[]) {
    return this.filter((field) => !names.includes(field.name))
  }

  only(...names: string[]) {
    return this.filter((field) => names.includes(field.name))
  }

  map(func: *) {
    return this.getFields().map<*>(func)
  }

  id() {
    return md5(this.tuple.join())
  }

  isPath(pathName: string) {
    return this.getString("_path") === pathName
  }

  constructor(tuple: Tuple, descriptor: Descriptor) {
    this.tuple = tuple
    this.descriptor = descriptor
  }

  getIndex(name: string) {
    return this.descriptor.findIndex((field) => field.name === name)
  }

  getString(name: string): string {
    let f = this.getField(name)
    if (f) return f.stringValue()
    else return ""
  }

  getField(fieldName: string): ?$Field {
    const index = this.getIndex(fieldName)
    if (inBounds(this.tuple, index)) {
      return this.getFieldAt(index)
    }
  }

  mustGetField(fieldName: string): $Field {
    let index = this.getIndex(fieldName)
    if (index === -1) throw new Error("Cannot find field: " + fieldName)
    return this.getFieldAt(index)
  }

  getFieldAt(index: number): $Field {
    if (index !== -1 && index < this.tuple.length) {
      const value = this.tuple[index]
      const {name, type} = this.descriptor[index]
      return brim.field({value, name, type})
    } else {
      throw "Index out of bounds"
    }
  }

  getFields(): $Field[] {
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
      if (
        isString(value) &&
        (type === "time" || type === "interval" || type === "duration")
      ) {
        return parseInt(value.split(".")[0])
      } else {
        throw new Error(`${name} is not a time, interval, or duration type`)
      }
    }
  }

  getNs(fieldName: string): number | void {
    const field = this.getField(fieldName)
    if (field) {
      const {name, type, value} = field
      if (
        isString(value) &&
        (type === "time" || type === "interval" || type === "duration")
      ) {
        return parseInt(value.split(".")[1] + "0000")
      } else {
        throw new Error(`${name} is not a time, interval, or duration type`)
      }
    }
  }

  cast(name: string) {
    let field = this.getField(name)
    if (field) {
      if (field.value === null) return null
      if (field.type === "time") return field.toDate()
      if (field.type === "interval") return parseFloat(field.value)
      if (field.type === "count") return parseInt(field.value)
      return field.value
    }
  }

  correlationId() {
    let name
    switch (this.getString("_path")) {
      case "files":
        name = "conn_uids"
        break
      case "dhcp":
        name = "uids"
        break
      default:
        name = "uid"
        break
    }

    let field = this.getField(name)
    if (field) {
      return field.queryableValue()
    } else {
      return ""
    }
  }

  toString() {
    return (
      this.descriptor.map((col) => [col.name, col.type].join(":")).join("\t") +
      "\t\t" +
      this.tuple.join("\t")
    )
  }
}
