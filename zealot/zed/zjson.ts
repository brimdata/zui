import {
  ZedArray,
  ZedEnum,
  ZedField,
  ZedMap,
  ZedPrimitive,
  ZedRecord,
  ZedSet,
  ZedUnion
} from "./index"
import ZedTypeDef from "./type-def"

type ID = string

export type Value = string | null | Value[]

export type RecordFieldType = {
  name: string
  type: Type
}

export type PrimitiveType = {
  kind: "primitive"
  name: string
}

export type RecordType = {
  kind: "record"
  fields: RecordFieldType[]
}

export type ArrayType = {
  kind: "array"
  type: Type
}

export type SetType = {
  kind: "set"
  type: Type
}

export type UnionType = {
  kind: "union"
  types: Type[]
}

export type EnumType = {
  kind: "enum"
  symbols: string[]
}

export type MapType = {
  kind: "map"
  key_type: Type
  val_type: Type
}

export type TypeDefType = {
  kind: "typedef"
  name: ID
  type: Type
}

export type TypeNameType = {
  kind: "typename"
  name: ID
}

export type Type =
  | PrimitiveType
  | RecordType
  | ArrayType
  | SetType
  | UnionType
  | EnumType
  | MapType
  | TypeDefType
  | TypeNameType

export type StreamObject = {
  schema: ID
  values: Value[]
  types: TypeDefType[]
}

export type TypeName = string

export type TypeContext = {[typeName: string]: ZedTypeDef}

export type DecodedZJSON = {
  rows: ZedRecord[]
  schemas: TypeContext
  context: TypeContext
}

export function construct(
  context: TypeContext,
  type: Type,
  value: Value,
  typeName?: TypeName
) {
  switch (type.kind) {
    case "primitive":
      return new ZedPrimitive({
        typeName,
        type: type.name,
        value: value as string
      })

    case "array":
      return new ZedArray({
        typeName,
        type: simpleType(type.type),
        items: (value as Value[]).map((value) =>
          construct(context, type.type, value)
        )
      })

    case "set":
      return new ZedSet({
        typeName,
        type: simpleType(type.type),
        items: (value as Value[]).map((value) =>
          construct(context, type.type, value)
        )
      })

    case "record":
      return new ZedRecord({
        typeName,
        fields: type.fields.map((field, index) => {
          return new ZedField({
            name: field.name,
            data: construct(context, field.type, value[index])
          })
        })
      })

    case "union":
      var [index, unionValue] = value as [string, string]
      return new ZedUnion({
        typeName,
        types: type.types.map(simpleType),
        value: construct(context, type.types[parseInt(index)], unionValue)
      })

    case "enum":
      return new ZedEnum({
        typeName,
        symbols: type.symbols,
        value: value as string
      })

    case "map":
      return new ZedMap({
        typeName,
        keyType: simpleType(type.key_type),
        valueType: simpleType(type.val_type),
        value: new Map(
          createEntries(value as Value[]).map(([key, value]) => {
            return [
              construct(context, type.key_type, key),
              construct(context, type.val_type, value)
            ]
          })
        )
      })

    case "typename":
      var def = context[type.name]
      if (!def) throw new Error("No typedef for: " + type.name)
      return construct(context, def.innerType, value, type.name)

    case "typedef":
      var def = new ZedTypeDef({type})
      context[def.name] = def
      return construct(context, def.innerType, value, def.name)

    default:
      throw new Error(`Unknown ZJSON Type: ${JSON.stringify(type)}`)
  }
}

function simpleType(type) {
  return type.kind === "primitive" ? type.name : type.kind
}

function createEntries(array) {
  const entries = []
  for (let i = 0; i < array.length; i += 2) {
    entries.push([array[i], array[i + 1]])
  }
  return entries
}

export function decode(
  zjson: StreamObject[],
  context: TypeContext = {},
  schemas: TypeContext = {}
): DecodedZJSON {
  const rows = []

  for (const {schema, types, values} of zjson) {
    // Add all the types to the context
    types &&
      types.forEach(
        (typedef) => (context[typedef.name] = new ZedTypeDef({type: typedef}))
      )

    // Add the root record type to the schemas
    const typedef = context[schema]
    if (!(schema in schemas)) schemas[schema] = typedef

    // Construct the row and save it
    const type = typedef.innerType
    const name = typedef.name
    rows.push(construct(context, type, values, name))
  }

  return {
    rows,
    schemas,
    context
  }
}
