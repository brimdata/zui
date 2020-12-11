export interface Item {
  id: number
  schema?: Schema
  aliases?: PrimitiveColumn[]
  values: Value[]
}

export type Items = Item[]
export type Schema = Record
export type Type = Primitive | Record | Array | Set | Union
export type Column =
  | PrimitiveColumn
  | RecordColumn
  | ArrayColumn
  | SetColumn
  | UnionColumn

export type Value = string | null | Value[]

type RecordColumn = Name & Record
type ArrayColumn = Name & Array
type SetColumn = Name & Set
type UnionColumn = Name & Union

interface Name {
  name: string
}

interface PrimitiveColumn {
  name: string
  type: Primitive
}

export interface Record {
  type: "record"
  of: Column[]
}

interface Array {
  type: "array"
  of: Type
}

interface Set {
  type: "set"
  of: Type
}

interface Union {
  type: "union"
  of: Type[]
}

export type Primitive =
  | "string"
  | "int32"
  | "byte"
  | "int16"
  | "int32"
  | "int64"
  | "uint16"
  | "uint32"
  | "uint64"
  | "float64"
  | "ip"
  | "net"
  | "duration"
  | "bstring"
  | "zenum"
  | "bool"
  // zeek primitives
  | "int"
  | "count"
  | "double"
  | "addr"
  | "subnet"
  | "interval"
  | "enum"
  | "port"
  | "time"

export type Container = "record" | "union" | "array" | "set"

export type TypeName = Primitive | Container
