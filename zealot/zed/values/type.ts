import {isNull} from "../utils"
import {TypeType} from "../types/type-type"
import {ZedType} from "../types/types"
import {typeId} from "../utils"

export class TypeValue {
  type = TypeType

  constructor(public value: ZedType | null = null) {}

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
}
