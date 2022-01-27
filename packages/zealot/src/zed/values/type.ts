import {TypeType} from "../types/type-type"
import {Type} from "../types/types"
import {isNull} from "../utils/is-null"
import {typeId} from "../utils/type-id"
import {JSOptions, Value} from "./types"

export class TypeValue implements Value {
  type: typeof TypeType = TypeType

  constructor(public value: Type | null = null) {}

  isUnset() {
    return isNull(this.value)
  }

  toString() {
    if (isNull(this.value)) return "null"
    return this.value.toString()
  }

  serialize() {
    if (isNull(this.value)) return null
    else return typeId(this.value)
  }

  toJS(opts: JSOptions = {}) {
    if (isNull(this.value)) return null
    return this.toString()
  }
}
