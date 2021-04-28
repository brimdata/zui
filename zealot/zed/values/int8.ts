import {isNull} from "lodash"
import {TypeInt8} from "../types/type-int8"
import {Primitive} from "./primitive"

export class Int8 extends Primitive {
  type = TypeInt8

  toInt() {
    if (isNull(this.value)) return null
    return parseInt(this.value)
  }
}
