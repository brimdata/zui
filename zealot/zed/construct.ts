import {
  ZedRecord,
  ZedPrimitive,
  ZedArray,
  ZedSet,
  ZedUnion,
  ZedEnum,
  ZedMap
} from "./data-types"
import ZedTypeDef from "./type-def"
import {TypeContext, Value, TypeName, Type} from "./zjson"

export function construct(
  context: TypeContext,
  type: Type,
  value: Value,
  name?: TypeName
) {
  switch (type.kind) {
    case "record":
      return new ZedRecord({type, value: value as Value[], context, name})
    case "primitive":
      return new ZedPrimitive({type, value: value as string, name})
    case "array":
      return new ZedArray({type, value: value as Value[], name, context})
    case "set":
      return new ZedSet({type, value: value as Value[], name, context})
    case "union":
      return new ZedUnion({type, value: value as Value[], name})
    case "enum":
      return new ZedEnum({type, value: value as string, name})
    case "map":
      return new ZedMap({type, value: value as Value[], name})
    case "typename":
      var def = context.get(type.name)
      if (!def) {
        console.log("No typedef in context for", type)
        console.log(context)
      }
      return construct(context, def.innerType, value, type.name)
    case "typedef":
      var def = new ZedTypeDef({type})
      context.set(def.name, def)
      return construct(context, def.innerType, value, def.name)
    default:
      throw new Error(`Unknown ZJSON Type: ${JSON.stringify(type)}`)
  }
}
