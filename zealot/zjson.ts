type ID = string

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

export type RootRecord = {
  schema: ID
  values: Value[]
  types?: TypeDefType[]
}
// Just to know which decode method to call
export type FieldRootRecord = RootRecord

export type TypeName = string

export type Value = string | null | Value[]

export type ArrayValue = Value[] | null

export type TypeContext = object
