import {isEmpty, isNull, isString} from "lodash"
import {Null} from "../index"
import {TypeAlias} from "../types/type-alias"
import {TypeRecord} from "../types/type-record"
import {ZedType} from "../types/types"
import {flatColumns} from "../utils/flat-columns"
import {trueType} from "../utils/true-type"
import {Field} from "./field"
import {ZedValue, Value} from "./types"

type ColumnName = string | string[]

export class Record implements Value {
  constructor(
    public type: TypeRecord | TypeAlias,
    public fields: Field[] | null
  ) {}

  get null() {
    return this.fields === null
  }

  get flatColumns(): ColumnName[] {
    return flatColumns(this.trueType)
  }

  get columns() {
    if (isNull(this.fields)) return []
    return this.fields.map((f) => f.name)
  }

  get trueType(): TypeRecord {
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
        return field.value._getField(namePart, field)
      } else {
        throw new Error(`${namePart} is not a record`)
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

  private _getField(name: string, parent?: Field): Field {
    if (!this.trueType.has(name)) {
      throw new UnknownColumnError(name, this.columns)
    }
    if (isNull(this.fields)) {
      return new Field(name, new Null(), parent || this)
    } else {
      return this.fields.find((f) => f.name == name)!
    }
  }

  isUnset() {
    return isNull(this.fields)
  }

  toJS() {
    if (isNull(this.fields)) return null
    return this.fields.reduce((obj, field) => {
      obj[field.name] = field.value.toJS()
      return obj
    }, {} as {[key: string]: any})
  }
}

class UnknownColumnError extends Error {
  constructor(unknown: string, names: string[]) {
    const available = names.map((n) => `"${n}"`).join(", ")
    super(`"${unknown}" not present in [${available}]`)
  }
}
