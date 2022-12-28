import {isArray, isEmpty, isNull, isNumber, isString} from "lodash"
import {zed} from "../.."
import {EncodeStream} from "../encode-stream"
import {Null} from "../index"
import {TypeAlias} from "../types/type-alias"
import {TypeRecord} from "../types/type-record"
import {ZedType} from "../types/types"
import {flatColumns} from "../utils/flat-columns"
import {trueType} from "../utils/true-type"
import {Field} from "./field"
import {ZedValue, Value, JSOptions} from "./types"

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
    return trueType(this.type) as TypeRecord
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

  serialize(stream: EncodeStream) {
    if (isNull(this.fields)) return null
    return this.fields.map((f) => stream.encodeValue(f.value))
  }

  at(index: number | number[]) {
    return this.fieldAt(index)?.value ?? null
  }

  fieldAt(index: number | number[]): null | zed.Field {
    if (isNull(this.fields)) return null
    if (isNumber(index)) return this.fields[index]
    if (isArray(index)) {
      if (index.length === 1) return this.fieldAt(index[0])
      const [head, ...tail] = index
      const value = this.fieldAt(head)?.value
      // Probably bugs in this
      if (!value) return null
      if (!(value instanceof zed.Record)) {
        throw new Error("Not a record")
      }
      return value.fieldAt(tail)
    } else {
      throw new Error("Argument must be number | number[]")
    }
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

  toJS(opts: JSOptions = {}) {
    if (isNull(this.fields)) return null
    return this.fields.reduce((obj, field) => {
      obj[field.name] = field.value.toJS(opts)
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
