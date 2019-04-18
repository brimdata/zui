/* @flow */

import Log from "../models/Log"

const dateSerializer = {
  serialize: (date: Date) => date.getTime(),
  deserialize: (time: number) => new Date(time)
}

const basicSerializer = {
  serialize: (v: *) => v,
  deserialize: (v: *) => v
}

const logSerializer = {
  serialize: (log: Log) => ({tuple: log.tuple, descriptor: log.descriptor}),
  deserialize: (obj: Object) => new Log(obj.tuple, obj.descriptor)
}

export function getSerializer(type: string) {
  switch (type) {
    case "Number":
    case "Null":
    case "Object":
    case "Array":
    case "String":
    case "Boolean":
      return basicSerializer
    case "Date":
      return dateSerializer
    case "Log":
      return logSerializer
    default:
      throw new Error(`Can't Serialize '${type}' type`)
  }
}
