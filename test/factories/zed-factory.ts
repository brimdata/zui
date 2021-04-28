import {isDate, isInteger, isNumber, isObject, isString} from "lodash"
import {zed} from "zealot"

// Convert a js object into a zed record
export function createRecord(object): zed.Record {
  let fields = []
  for (let name in object) {
    fields.push(createField(name, object[name]))
  }
  // If the tests need the type, create it.
  return new zed.Record(null, fields)
}

export function createField(name, value) {
  return new zed.Field(name, createData(value))
}

export function createData(value) {
  if (value === null) {
    return new zed.Null()
  }

  if (isDate(value)) {
    return new zed.Time((value.getTime() / 1000).toString())
  }

  if (isInteger(value)) {
    return new zed.Uint64(value.toString())
  }

  if (isNumber(value)) {
    return new zed.Float64(value.toString())
  }

  if (isString(value) && isIp(value)) {
    return new zed.Ip(value)
  }

  if (isString(value)) {
    return new zed.String(value)
  }

  if (isObject(value)) {
    return createRecord(value)
  }

  throw new Error(`Implement this: ${JSON.stringify(value)}`)
}

function isIp(string) {
  const blocks: any[] = string.split(".")
  if (blocks.length !== 4) return false
  return blocks.every((block) => {
    return Number(block) >= 0 && Number(block) <= 255
  })
}
