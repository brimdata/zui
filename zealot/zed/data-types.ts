import {construct} from "./construct"
import {
  ArrayType,
  EnumType,
  MapType,
  PrimitiveType,
  RecordFieldType,
  RecordType,
  SetType,
  Type,
  TypeContext,
  TypeName,
  TypeNameType,
  UnionType,
  Value
} from "./zjson"

export type ZedData =
  | ZedPrimitive
  | ZedRecord
  | ZedArray
  | ZedSet
  | ZedUnion
  | ZedEnum
  | ZedMap

/**
 * Base Class for all Zed Data Types
 */
export type ZedTypeArgs<T, V> = {
  type: T
  value: V
  name?: TypeName
  context?: TypeContext
}

export class ZedType<T extends Type, V> {
  public _type: T
  public _value: V
  public _name?: TypeName

  constructor(args: ZedTypeArgs<T, V>) {
    this._type = args.type
    this._value = args.value
    this._name = args.name
  }

  get kind(): string {
    return this._name || this._type.kind
  }

  toString() {
    return this._value ? this._value.toString() : ""
  }

  isUnset() {
    return this._value === null
  }

  serialize() {
    return {
      name: this._name,
      type: this._type,
      value: this._value
    }
  }
}

/**
 * Holds a name and a data field
 */

export type ZedFieldSpec = {
  name: string
  data: {
    name?: string
    type: Type
    value: Value
  }
}
export class ZedField {
  name: string
  data: ZedData

  static deserialize({name, data}: ZedFieldSpec) {
    return new ZedField({
      name,
      data: construct(new Map(), data.type, data.value, data.name)
    })
  }

  constructor({name, data}: {name: string; data: ZedData}) {
    this.name = name
    this.data = data
  }

  serialize(): ZedFieldSpec {
    return {
      name: this.name,
      data: this.data.serialize()
    }
  }
}

export class ZedPrimitive extends ZedType<PrimitiveType, string | null> {
  get kind() {
    return this._name || this._type.name
  }

  toDate() {
    if (this._value === null || this._type.name != "time") {
      throw new Error(`Cannot make type: ${this._type.name} into a Date`)
    }
    return new Date(+this._value * 1000)
  }

  toFloat() {
    if (this._value === null) {
      return 0
    }
    try {
      return parseFloat(this._value)
    } catch {
      throw new Error(`Cannot make type: ${this._type.name} into a Float`)
    }
  }

  toInt() {
    if (this._value === null) throw new Error("value is unset")
    const int = parseInt(this._value)
    if (isNaN(int)) {
      throw new Error(`Cannot make type: ${this._type.name} into an Integer`)
    }
    return int
  }
}

export class ZedArray extends ZedType<ArrayType, Value[]> {
  items: ZedData[]

  constructor(args: {
    type: ArrayType
    value: Value[]
    context: TypeContext
    name: TypeName
  }) {
    super(args)
    this.items = (this._value || []).map((value) =>
      construct(args.context, args.type.type, value)
    )
  }

  get innerType() {
    return this._type.type
  }
}

export class ZedSet extends ZedType<SetType, Value[]> {
  items: ZedData[]

  constructor(args: {
    type: SetType
    value: Value[]
    context: TypeContext
    name: TypeName
  }) {
    super(args)
    this.items = (this._value || []).map((value) =>
      construct(args.context, args.type.type, value)
    )
  }

  get innerType() {
    return this._type.type
  }
}

// Need use cases
export class ZedUnion extends ZedType<UnionType, Value[]> {}
// Need use cases
export class ZedEnum extends ZedType<EnumType, string> {}
// Need use cases
export class ZedMap extends ZedType<MapType, Value[]> {}
// Need use cases
export class ZedTypeName extends ZedType<TypeNameType, string> {}

class UnknownColumnError extends Error {
  constructor(unknown: string, names: string[]) {
    const available = names.map((n) => `"${n}"`).join(", ")
    super(`"${unknown}" not present in [${available}]`)
  }
}

export type ZedRecordSpec = {
  type: RecordType
  value: Value[]
  name?: TypeName
}

export class ZedRecord extends ZedType<RecordType, Value[]> {
  fields: ZedField[]
  context: TypeContext

  static of(fields: RecordFieldType[], values: Value[]) {
    return new ZedRecord({type: {kind: "record", fields}, value: values})
  }

  static deserialize(args: ZedRecordSpec) {
    console.log(args)
    return new ZedRecord(args)
  }

  constructor(args: ZedTypeArgs<RecordType, Value[]>) {
    super(args)
    this.context = args.context || new Map()
    this.fields = this._value.map((value, index) => {
      const {name, type} = this._type.fields[index]
      return new ZedField({
        name,
        data: construct(args.context || new Map(), type, value)
      })
    })
  }

  [Symbol.iterator]() {
    let index = 0
    const next = () =>
      index < this._type.fields.length
        ? {done: false, value: this.at(index++)}
        : {done: true, value: undefined}

    return {next}
  }

  get columns() {
    return this.fields.map((f) => f.name)
  }

  at(index: number) {
    return this.fields[index].data
  }

  get(name: string) {
    return this.getField(name).data
  }

  try(name: string) {
    try {
      return this.get(name)
    } catch {
      return null
    }
  }

  private _getField(name: string) {
    if (this.isUnset()) throw new Error("Record is unset")
    const field = this.fields.find((f) => f.name == name)
    if (!field) throw new UnknownColumnError(name, this.columns)
    return field
  }

  getField(name: string) {
    return name
      .split(".")
      .reduce<ZedField>((field: ZedField, namePart: string) => {
        if (field.data instanceof ZedRecord) {
          return new ZedField({name, data: field.data._getField(namePart).data})
        } else {
          throw new Error("Dot syntax is only for nested records")
        }
      }, new ZedField({name: "", data: this}))
  }

  tryField(name: string) {
    try {
      return this.getField(name)
    } catch {
      return null
    }
  }

  has(name: string) {
    return this.columns.includes(name)
  }

  flatten(prefix = ""): ZedRecord {
    let fields = []
    let vals = []

    this._type.fields.forEach((field, index) => {
      if (field.type.kind === "record") {
        const nested = (this.at(index) as ZedRecord).flatten(field.name + ".")
        fields = fields.concat(nested._type.fields)
        vals = vals.concat(nested._value)
      } else {
        fields.push({...field, name: prefix + field.name})
        // For an unset record, supply an unset value for each column.
        vals.push(this.isUnset() ? null : this._value![index])
      }
    })
    const type = {kind: "record", fields} as RecordType
    return new ZedRecord({type, value: vals, context: this.context})
  }
}
