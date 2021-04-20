import {isDate, isInteger, isNumber, isObject, isString} from "lodash"
import {ZedField, ZedPrimitive, ZedRecord} from "zealot/zed"

// Convert a js object into a zed record
export function createRecord(object): ZedRecord {
  let fields = []
  for (let name in object) {
    fields.push(createField(name, object[name]))
  }
  return new ZedRecord({fields})
}

export function createField(name, value) {
  return new ZedField({
    name,
    data: createData(value)
  })
}

export function createData(value) {
  if (value === null) {
    return new ZedPrimitive({type: "null", value: null})
  }

  if (isDate(value)) {
    return new ZedPrimitive({
      type: "time",
      value: (value.getTime() / 1000).toString()
    })
  }

  if (isInteger(value)) {
    return new ZedPrimitive({type: "uint64", value: value.toString()})
  }

  if (isNumber(value)) {
    return new ZedPrimitive({type: "float64", value: value.toString()})
  }

  if (isString(value) && isIp(value)) {
    return new ZedPrimitive({type: "ip", value})
  }

  if (isString(value)) {
    return new ZedPrimitive({type: "string", value})
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
