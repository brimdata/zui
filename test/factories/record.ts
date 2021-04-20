import {isDate, isString} from "lodash"
import {ZedField, ZedPrimitive, ZedRecord} from "zealot/zed"

// Only primitive values for now
export function recordOf(...fields) {
  return new ZedRecord({
    fields: fields.map(([name, type, value]) => {
      return new ZedField({name, data: new ZedPrimitive({type, value})})
    })
  })
}

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
  if (isString(value)) {
    return new ZedPrimitive({type: "string", value})
  } else if (isDate(value)) {
    return new ZedPrimitive({
      type: "time",
      value: (value.getTime() / 1000).toString()
    })
  } else {
    throw new Error(`Implement this: ${JSON.stringify(value)}`)
  }
}
