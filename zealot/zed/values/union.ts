import {TypeUnion} from "../types/type-union"
import {ZedTypeInterface} from "../types/types"
import {isNull} from "../utils"
import {ZedValueInterface} from "./types"

export class Union implements ZedValueInterface {
  constructor(
    public type: TypeUnion,
    public innerType: ZedTypeInterface,
    public index: number | null,
    public value: ZedValueInterface | null
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
