import {TypeUnion} from "../types/type-union"
import {Type} from "../types/types"
import {isNull} from "../utils/is-null"
import {JSOptions, Value} from "./types"

export class Union implements Value {
  constructor(
    public type: TypeUnion,
    public innerType: Type,
    public index: number | null,
    public value: Value | null
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

  toJS(opts: JSOptions = {}) {
    if (this.isUnset()) return null
    return this.value?.toJS()
  }
}
