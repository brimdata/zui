import {isDate, isInteger, isNumber, isObject, isString} from "lodash"
import {decode, encode, zed} from "../index"
import {DefaultContext} from "../zed/context"
import {TypeRecord} from "../zed/index"

// Convert a js object into a zed record

export function createRecord(object: {[key: string]: unknown}): zed.Record {
  let fields: zed.Field[] = []
  for (let name in object) {
    fields.push(createField(name, object[name]))
  }
  const typeFields: zed.TypeField[] = fields.map((f) => ({
    name: f.name,
    type: f.value.type,
  }))

  // This could be more efficient
  const type: TypeRecord = DefaultContext.lookupTypeRecord(typeFields)
  const r = new zed.Record(type, fields)
  // This is necessary at the moment to add field parents,
  // and to match the codepath that runs in production.
  return decode(encode(r)) as zed.Record
}

export function createField(name: string, value: unknown): zed.Field {
  return new zed.Field(name, createData(value), null)
}

export function createData(value: unknown): zed.Value {
  if (value instanceof zed.Primitive) {
    return value as zed.Value
  }

  if (value === null) {
    return new zed.Null()
  }

  if (isDate(value)) {
    return new zed.Time((value.getTime() / 1000).toString())
  }

  if (isInteger(value)) {
    return new zed.Uint64((value as number).toString())
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
    return createRecord(value as {[k: string]: unknown})
  }

  throw new Error(`Implement this: ${JSON.stringify(value)}`)
}

function isIp(string: string) {
  const blocks: any[] = string.split(".")
  if (blocks.length !== 4) return false
  return blocks.every((block) => {
    return Number(block) >= 0 && Number(block) <= 255
  })
}
