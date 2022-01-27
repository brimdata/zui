import {isNull} from "../utils/is-null"
import {TypeUint16} from "../types/type-uint16"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

export class Uint16 extends Primitive {
  type: typeof TypeUint16 = TypeUint16

  toInt() {
    if (isNull(this.value)) return null
    return parseInt(this.value)
  }

  toJS(opts: JSOptions = {}) {
    return this.toInt()
  }
}
