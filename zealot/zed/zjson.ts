import {construct} from "./construct"
import {ZedRecord} from "./data-types"
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

export type TypeContext = Map<TypeName, ZedTypeDef>

export type DecodedZJSON = {
  rows: ZedRecord[]
  schemas: TypeContext
  context: TypeContext
}

export function decode(
  zjson: StreamObject[],
  context: TypeContext = new Map(),
  schemas: TypeContext = new Map()
): DecodedZJSON {
  const rows = []

  for (const {schema, types, values} of zjson) {
    // Add all the types to the context
    types &&
      types.forEach((typedef) =>
        context.set(typedef.name, new ZedTypeDef({type: typedef}))
      )

    // Add the root record type to the schemas
    const typedef = context.get(schema)
    if (!schemas.has(schema)) schemas.set(schema, typedef)

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
