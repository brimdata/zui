import {TypeBytes} from "../types/type-bytes"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

export class Bytes extends Primitive {
  type: typeof TypeBytes = TypeBytes

  toJS(opts: JSOptions = {}) {
    return this.toString()
  }
}
