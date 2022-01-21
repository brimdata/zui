import {isNull} from "../utils/is-null"
import {TypeInt64} from "../types/type-int64"
import {Primitive} from "./primitive"

export class Int64 extends Primitive {
  type: typeof TypeInt64 = TypeInt64

  toInt() {
    if (isNull(this.value)) return null
    return parseInt(this.value)
  }

  toBigInt() {
    if (isNull(this.value)) return null
    return BigInt(this.value)
  }

  toJS() {
    return this.toBigInt()
  }
}
