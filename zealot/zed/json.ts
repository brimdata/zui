import {
  ZedArray,
  ZedPrimitive,
  ZedEnum,
  ZedMap,
  ZedRecord,
  ZedSet,
  ZedUnion,
  ZedData,
  ZedField
} from "./index"

export type SerializedZed =
  | SerializedZedPrimitive
  | SerializedZedArray
  | SerializedZedSet
  | SerializedZedRecord
  | SerializedZedUnion
  | SerializedZedEnum
  | SerializedZedMap
  | SerializedZedField

export type SerializedZedField = {
  kind: "field"
  name: string
  data: SerializedZed
}

export type SerializedZedPrimitive = {
  kind: "primitive"
  value: string | null
  type: string
  typeName?: string
}

export type SerializedZedArray = {
  kind: "array"
  type: string
  items: SerializedZed[]
  typeName?: string
}

export type SerializedZedSet = {
  kind: "set"
  type: string
  items: SerializedZed[]
  typeName?: string
}

export type SerializedZedRecord = {
  kind: "record"
  fields: SerializedZedField[]
  typeName?: string
}

export type SerializedZedUnion = {
  kind: "union"
  types: string[]
  value: SerializedZed
  typeName?: string
}

export type SerializedZedEnum = {
  kind: "enum"
  symbols: string[]
  value: string
  typeName?: string
}

export type SerializedZedMap = {
  kind: "map"
  keyType: string
  valueType: string
  value: [SerializedZed, SerializedZed][]
  typeName?: string
}

export function deserialize(data: SerializedZed) {
  switch (data.kind) {
    case "primitive":
      return new ZedPrimitive({
        typeName: data.typeName,
        value: data.value,
        type: data.type
      })

    case "array":
      return new ZedArray({
        typeName: data.typeName,
        type: data.type,
        items: data.items.map(deserialize)
      })

    case "set":
      return new ZedSet({
        typeName: data.typeName,
        type: data.type,
        items: data.items.map(deserialize) as ZedData[]
      })

    case "record":
      return new ZedRecord({
        typeName: data.typeName,
        fields: data.fields.map(deserialize) as ZedField[]
      })

    case "field":
      return new ZedField({
        name: data.name,
        data: deserialize(data.data)
      })

    case "union":
      return new ZedUnion({
        typeName: data.typeName,
        types: data.types,
        value: deserialize(data.value)
      })

    case "enum":
      return new ZedEnum({
        typeName: data.typeName,
        symbols: data.symbols,
        value: data.value
      })

    case "map":
      return new ZedMap({
        typeName: data.typeName,
        keyType: data.keyType,
        valueType: data.valueType,
        value: new Map(
          data.value.map(([key, value]) => {
            return [deserialize(key), deserialize(value)]
          })
        )
      })

    default:
      throw new Error(`Unknown Zed Type: ${JSON.stringify(data)}`)
  }
}
