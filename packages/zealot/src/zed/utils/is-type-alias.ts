import {TypeAlias} from "../types/type-alias"
import {Type} from "../types/types"

export function isTypeAlias(type: Type): type is TypeAlias {
  return type instanceof TypeAlias
}
