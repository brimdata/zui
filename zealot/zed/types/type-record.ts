import {Record} from "../values/record"
import {Value} from "../zjson"
import {ZedType} from "./types"
import {typeId} from "./utils"

type TypeField = {
  name: string
  type: ZedType
}
export class TypeRecord {
  kind = "record"
  fields: TypeField[]

  constructor(fields) {
    this.fields = fields
  }

  static stringify(fields) {
    let s = "{"
    let sep = ""
    fields.forEach((f) => {
      // XXX need to check if name has funny chars
      s += sep + f.name + ":" + typeId(f.type)
      sep = ","
    })
    s += "}"
    return s
  }

  create(values: Value, typedefs: object) {
    return new Record(
      this,
      this.fields.map((field, index) => {
        const value = values[index]
        if (!field.type.create) {
          console.log(field.type)
        }
        return {
          name: field.name,
          value: field.type.create(value, typedefs)
        }
      })
    )
  }
}
