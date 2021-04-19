import {
  ZedArray,
  ZedPrimitive,
  ZedEnum,
  ZedField,
  ZedMap,
  ZedRecord,
  ZedSet,
  ZedUnion
} from "./index"

export function deserialize(data) {
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
        items: data.items.map(deserialize)
      })

    case "record":
      return new ZedRecord({
        typeName: data.typeName,
        fields: data.fields.map(deserialize)
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
