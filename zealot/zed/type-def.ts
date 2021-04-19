import {RecordFieldType, TypeDefType} from "./zjson"

export default class ZedTypeDef {
  _type: TypeDefType

  constructor({type}: {type: TypeDefType}) {
    this._type = type
  }

  get name() {
    return this._type.name
  }

  get innerType() {
    return this._type.type
  }

  flatten(): ZedTypeDef {
    const inner = this.innerType
    if (inner.kind !== "record") return this

    const flat = (
      fields: RecordFieldType[],
      prefix = ""
    ): RecordFieldType[] => {
      return fields.flatMap((field) => {
        const name = prefix + field.name
        if (field.type.kind == "record") {
          return flat(field.type.fields, name + ".")
        } else {
          return {...field, name}
        }
      })
    }
    const fields = flat(inner.fields)

    return new ZedTypeDef({
      type: {name: this.name, kind: "typedef", type: {kind: "record", fields}}
    })
  }
}
