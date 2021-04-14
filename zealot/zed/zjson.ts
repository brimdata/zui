type ID = string | number

type Value = string | null | Value[]

type Field = {
  name: string
  type: Type
}

type PrimitiveType = {
  kind: "primitive"
  name: string
}

type RecordType = {
  kind: "record"
  fields: Field[]
}

type ArrayType = {
  kind: "array"
  type: Type
}

type SetType = {
  kind: "set"
  type: Type
}

type UnionType = {
  kind: "union"
  types: Type[]
}

type EnumType = {
  kind: "enum"
  symbols: string[]
}

type MapType = {
  kind: "map"
  key_type: Type
  val_type: Type
}

type TypeDefType = {
  kind: "typedef"
  name: ID
  type: Type
}

type TypeNameType = {
  kind: "typename"
  name: ID
}

type Type =
  | PrimitiveType
  | RecordType
  | ArrayType
  | SetType
  | UnionType
  | EnumType
  | MapType
  | TypeDefType
  | TypeNameType

type StreamObject = {
  schema: ID
  values: Value[]
  types: TypeDefType[]
}

type TypeName = string | number

class ZedType<T, V> {
  protected _type: T
  protected _value: V
  protected _name?: TypeName

  constructor(args: {type: T; value: V; name?: TypeName}) {
    this._type = args.type
    this._value = args.value
    this._name = args.name
  }

  missing() {
    return false
  }

  toString() {
    return this._value ? this._value.toString() : ""
  }
}

class Missing {
  constructor(readonly type: typeof ZedType, readonly name: string) {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (target[prop]) {
          return Reflect.get(target, prop, receiver)
        } else {
          return receiver
        }
      }
    })
  }

  toString() {
    return `Missing: "${this.name}" in ${this.type}`
  }

  missing() {
    return true
  }
}

type ZedData =
  | ZedPrimitive
  | ZedRecord
  | ZedTypeDef
  | ZedArray
  | ZedSet
  | ZedUnion
  | ZedEnum
  | ZedMap
  | ZedTypeName

class ZedField {
  name: string
  data: ZedData

  constructor({name, data}: {name: string; data: ZedData}) {
    this.name = name
    this.data = data
  }
}

function withQuickAccess(record, accessor) {
  return new Proxy(record, {
    get(target, property, receiver) {
      if (target[property]) {
        return Reflect.get(target, property, receiver)
      }
      const data = accessor(target, property)
      return data ? data : new Missing(target, property.toString())
    }
  })
}

class ZedPrimitive extends ZedType<PrimitiveType, string | null> {
  constructor(args) {
    super(args)
    return withQuickAccess(this, () => false)
  }
}
class ZedTypeDef extends ZedType<TypeDefType, Value> {
  get name() {
    return this._type.name
  }
}
class ZedArray extends ZedType<ArrayType, Value[]> {}
class ZedSet extends ZedType<SetType, Value[]> {}
class ZedUnion extends ZedType<UnionType, Value[]> {}
class ZedEnum extends ZedType<EnumType, string> {}
class ZedMap extends ZedType<MapType, Value[]> {}
class ZedTypeName extends ZedType<TypeNameType, string> {}

class ZedRecord extends ZedType<RecordType, Value[]> {
  fields: ZedField[]
  constructor(args) {
    super(args)
    this.fields = this._value.map((value, index) => {
      const {name, type} = this._type.fields[index]
      return new ZedField({
        name,
        data: construct(args.context, type, value, args.name)
      })
    })
    return withQuickAccess(
      this,
      (record, prop) => record.fields.find((f) => f.name === prop)?.data
    )
  }

  [Symbol.iterator]() {
    let index = 0
    const next = () =>
      index < this._type.fields.length
        ? {done: false, value: this.at(index++)}
        : {done: true, value: undefined}

    return {next}
  }

  at(index: number) {
    return this.fields[index]
  }

  get columns() {
    return this.fields.map((f) => f.name)
  }
}

class Rows extends Array {
  first() {
    return this[0]
  }
  last() {
    return this[this.length - 1]
  }
}

function construct(
  context: TypeContext,
  type: Type,
  value: Value,
  name?: TypeName
) {
  switch (type.kind) {
    case "record":
      return new ZedRecord({type, value, context, name})
    case "primitive":
      return new ZedPrimitive({type, value: value as string, name})
    case "array":
      return new ZedArray({type, value: value as Value[], name})
    case "set":
      return new ZedSet({type, value: value as Value[], name})
    case "union":
      return new ZedUnion({type, value: value as Value[], name})
    case "enum":
      return new ZedEnum({type, value: value as string, name})
    case "map":
      return new ZedMap({type, value: value as Value[], name})
    case "typename":
      var typedef = context.get(type.name)
      return construct(context, typedef.type, value, typedef.name)
    case "typedef":
      context.set(type.name, type)
      return construct(context, type.type, value, type.name)
    default:
      throw new Error(`Unknown ZJSON Type: ${JSON.stringify(type)}`)
  }
}

type TypeContext = Map<TypeName, TypeDefType>

export function parse(zjson: StreamObject[]) {
  const rows = new Rows()
  const context: TypeContext = new Map()
  const schemas = new Map<TypeName, true>()

  for (const object of zjson) {
    if (object.schema) schemas.set(object.schema, true)
    if (object.types) {
      object.types.forEach((typedef) => context.set(typedef.name, typedef))
    }
    const typedef = context.get(object.schema)

    const type = typedef.type
    const name = typedef.name
    const value = object.values
    rows.push(construct(context, type, value, name))
  }

  return {
    zjson,
    rows,
    schemas,
    context
  }
}
