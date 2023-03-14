import {decode, encode} from "../encoder"
import * as zed from "../zed"

// Convert a js object into a zed record

export function createRecord(object: {[key: string]: unknown}): zed.Record {
  let fields: zed.Field[] = []
  for (let name in object) {
    fields.push(createField(name, object[name]))
  }
  const typeFields = fields.map((f) => new zed.TypeField(f.name, f.value.type))

  // This could be more efficient
  const type: zed.TypeRecord = zed.DefaultContext.lookupTypeRecord(typeFields)
  const r = new zed.Record(type, fields)
  // This is necessary at the moment to add field parents,
  // and to match the codepath that runs in production.
  return decode(encode(r)) as zed.Record
}

export function createField(name: string, value: unknown): zed.Field {
  return new zed.Field(name, createData(value), null)
}

export function createData(value: unknown): zed.Value {
  if (zed.isValue(value)) {
    return value as zed.Value
  }

  if (value === null) {
    return new zed.Null()
  }

  if (value instanceof Date) {
    return new zed.Time((value.getTime() / 1000).toString())
  }

  if (Number.isInteger(value)) {
    return new zed.Uint64((value as number).toString())
  }

  if (typeof value === "number") {
    return new zed.Float64(value.toString())
  }

  if (typeof value === "string" && isIp(value)) {
    return new zed.Ip(value)
  }

  if (typeof value === "string") {
    return new zed.String(value)
  }

  if (typeof value === "object" && value?.constructor === Object) {
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
