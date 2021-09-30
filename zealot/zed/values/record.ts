import {isEmpty, isNull, isString} from "lodash"
import {TypeAlias} from "../types/type-alias"
import {TypeField, TypeRecord} from "../types/type-record"
import {ZedType} from "../types/types"
import {flatColumns, trueType} from "../utils"
import {Field} from "./field"
import {ZedValue, ZedValueInterface} from "./types"
export class Record implements ZedValueInterface {
  constructor(
    public type: TypeRecord | TypeAlias,
    public fields: Field[] | null
  ) {}

  get null() {
    return this.fields === null
  }

  get flatColumns() {
    return flatColumns(this.trueType)
  }

  get columns() {
    if (isNull(this.fields)) return []
    return this.fields.map((f) => f.name)
  }

  get trueType() {
    return trueType<TypeRecord>(this.type)
  }

  toString() {
    if (isNull(this.fields)) return "null"
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
    if (isNull(this.fields)) return null
    return this.fields.map((f) => f.value.serialize())
  }

  at(index: number) {
    return this.fieldAt(index)?.value
  }

  fieldAt(index: number) {
    if (isNull(this.fields)) return null
    return this.fields[index]
  }

  has(name: string | string[], ...types: ZedType[]) {
    try {
      let type = this.get(name).type
      return types.length === 0 ? true : types.some((t) => type === t)
    } catch (e) {
      return false
    }
  }

  get<T extends ZedValue>(name: string | string[]): T {
    return this.getField(name).value as T
  }

  getField(name: string | string[]): Field {
    if (isString(name)) return this._getField(name)
    if (isEmpty(name)) throw new Error("No fields specified")

    return name.reduce<Field | null>((field, namePart) => {
      if (!field) return this._getField(namePart)
      if (field.value instanceof Record) {
        const next = field.value._getField(namePart)
        next.parents = field.path
        return next
      } else {
        throw new Error("Dot syntax is only for nested records")
      }
    }, null) as Field
  }

  try<T extends ZedValue>(name: string | string[]): T | null {
    try {
      return this.get(name) as T
    } catch {
      return null
    }
  }

  tryField(name: string | string[]) {
    try {
      return this.getField(name)
    } catch {
      return null
    }
  }

  private _getField(name: string) {
    if (isNull(this.fields)) throw new Error("Record is unset")
    const field = this.fields.find((f) => f.name == name)
    if (!field) throw new UnknownColumnError(name, this.columns)
    return field
  }

  flatten(prefix = ""): Record | null {
    if (isNull(this.fields)) return null

    let fields: Field[] = []
    let typeFields: TypeField[] = []

    this.fields.forEach((field) => {
      if (field.value instanceof Record) {
        const record = field.value.flatten(field.name + ".")
        if (!record) return
        typeFields = typeFields.concat(record.trueType.fields || [])
        fields = fields.concat(record.fields || [])
      } else {
        const name = prefix + field.name
        const value = field.value
        const type = field.value.type
        typeFields.push({name, type})
        fields.push(new Field(name, value))
      }
    })
    const type = new TypeRecord(typeFields)
    return new Record(type, fields)
  }

  isUnset() {
    return isNull(this.fields)
  }
}

class UnknownColumnError extends Error {
  constructor(unknown: string, names: string[]) {
    const available = names.map((n) => `"${n}"`).join(", ")
    super(`"${unknown}" not present in [${available}]`)
  }
}
