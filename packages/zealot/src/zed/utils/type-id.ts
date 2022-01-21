import {BasePrimitive} from "../types/base-primitive"
import {TypeAlias} from "../types/type-alias"
import {Type} from "../types/types"

export function typeId(type: Type) {
  if (type instanceof BasePrimitive) {
    return type.name
  }
  if (type instanceof TypeAlias) {
    return type.name
  }
  if (type.id) {
    return type.id.toString()
  }
  throw new Error("Does not have an id")
}
