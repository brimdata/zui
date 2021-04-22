import {ZedRecord} from ".."
import {typeId} from "./utils"

export class TypeRecord {
  kind = "record"
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
  create(values, typedefs) {
    return new ZedRecord(
      this,
      this.fields.map((field, index) => ({
        name: field.name,
        value: field.type.create(values[index])
      }))
    )
  }
}
