import {isNull} from "../utils"
import {TypeInt16} from "../types/type-int16"
import {Primitive} from "./primitive"

export class Int16 extends Primitive {
  type = TypeInt16

  toInt() {
    if (isNull(this.value)) return null
    return parseInt(this.value)
  }
}
