import {isNull} from "../utils"
import {TypeUint32} from "../types/type-uint32"
import {Primitive} from "./primitive"

export class Uint32 extends Primitive {
  type = TypeUint32

  toInt() {
    if (isNull(this.value)) return null
    return parseInt(this.value)
  }
}
