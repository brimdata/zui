import {isNull} from "../utils"
import {RecordType, Value} from "../../zjson"
import {ZedContext} from "../context"
import {typeId} from "../utils"
import {Field} from "../values/field"
import {Record} from "../values/record"
import {ContainerTypeInterface, ZedType} from "./types"

export type TypeField = {
  name: string
  type: ZedType
}
export class TypeRecord implements ContainerTypeInterface {
  kind = "record"
  fields: TypeField[]

  constructor(fields: TypeField[]) {
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
    if (values === null) return new Record(this, null)
    return new Record(
      this,
      this.fields.map((field, index) => {
        return new Field(field.name, field.type.create(values[index], typedefs))
      })
    )
  }

  serialize(typedefs): RecordType {
    return {
      kind: "record",
      fields: this.fields.map((f) => {
        return {
          name: f.name,
          type: f.type.serialize(typedefs)
        }
      })
    }
  }

  hasTypeType(ctx: ZedContext) {
    return this.fields.some((f) => ctx.hasTypeType(f.type))
  }

  walkTypeValues(ctx: ZedContext, values, visit) {
    if (isNull(values)) return

    this.fields.forEach((f, i) => {
      ctx.walkTypeValues(f.type, values[i], visit)
    })
  }
}
