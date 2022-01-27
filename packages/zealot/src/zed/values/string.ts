import {TypeString} from "../types/type-string"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

export class String extends Primitive {
  type: typeof TypeString = TypeString

  toJS(opts: JSOptions = {}) {
    return this.toString()
  }
}
