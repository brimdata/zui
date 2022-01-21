import {Type} from "../types/types"
import {isTypeAlias} from "./is-type-alias"

export function trueType<T extends Type>(start: Type): T {
  let t = start
  while (isTypeAlias(t)) {
    t = t.type
  }
  return t as T
}
