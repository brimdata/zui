import {trueType} from "./index"
import {flatColumns} from "./utils"
import {TypeField, TypeRecord} from "./types/type-record"

export class Schema {
  constructor(public name: string, public type: TypeRecord) {}

  flatColumns() {
    return flatColumns(this.type)
  }

  flatten(): Schema {
    const inner = trueType<TypeRecord>(this.type)

    const flat = (fields: TypeField[], prefix = ""): TypeField[] => {
      return fields.flatMap((field) => {
        const name = prefix + field.name
        const type = trueType(field.type)
        if (type instanceof TypeRecord) {
          return flat(type.fields || [], name + ".")
        } else {
          return {name, type}
        }
      })
    }
    const fields = flat(inner.fields || [])

    return new Schema(this.name, new TypeRecord(fields))
  }
}
