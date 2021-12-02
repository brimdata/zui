import {isNull} from "../utils"
import {TypeUnion} from "../types/type-union"
import {ZedType} from "../types/types"
import {ZedValue, ZedValueInterface} from "./types"

export class Union implements ZedValueInterface {
  constructor(
    public type: TypeUnion,
    public innerType: ZedType,
    public index: number | null,
    public value: ZedValue | null
  ) {}

  toString() {
    if (isNull(this.value)) return "null"
    return this.value.toString()
  }

  serialize() {
    if (isNull(this.index) || isNull(this.value)) return null
    return [this.index.toString(), this.value.serialize()]
  }

  isUnset() {
    return isNull(this.index) || isNull(this.value)
  }
}
