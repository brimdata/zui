import {isNull} from "../utils"
import {TypeUint8} from "../types/type-uint8"
import {Primitive} from "./primitive"

export class Uint8 extends Primitive {
  type = TypeUint8

  toInt() {
    if (isNull(this.value)) return null
    return parseInt(this.value)
  }
}
