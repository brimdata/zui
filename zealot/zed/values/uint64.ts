import {isNull} from "lodash"
import {TypeUint64} from "../types/type-uint64"
import {Primitive} from "./primitive"

export class Uint64 extends Primitive {
  type = TypeUint64

  toInt() {
    if (isNull(this.value)) return null
    return parseInt(this.value)
  }
}
