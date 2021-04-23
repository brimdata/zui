import {TypeRecord} from "../types/type-record"
import {ZedField, ZedValueInterface} from "./types"

export class Record implements ZedValueInterface {
  constructor(public type: TypeRecord, public fields: ZedField[]) {}

  toString() {
    let s = "{"
    let sep = ""
    this.fields.forEach((f) => {
      // XXX need to check if name has funny chars
      s += sep + f.name + ":" + f.value.toString()
      sep = ","
    })
    s += "}"
    return s
  }
  serialize() {
    let values = []
    this.fields.forEach((f) => {
      values.push(f.value.serialize())
    })
    return values
  }
}
