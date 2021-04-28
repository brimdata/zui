import {isNull} from "lodash"
import {TypeInt64} from "../types/type-int64"
import {Primitive} from "./primitive"

export class Int64 extends Primitive {
  type = TypeInt64

  toInt() {
    if (isNull(this.value)) return null
    return parseInt(this.value)
  }
}
