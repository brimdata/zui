/* @flow */

const dateSerializer = {
  serialize: (date: Date) => date.getTime(),
  deserialize: (time: number) => new Date(time)
}

const basicSerializer = {
  serialize: (v: *) => v,
  deserialize: (v: *) => v
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
    default:
      throw new Error(`Can't Serialize '${type}' type`)
  }
}
