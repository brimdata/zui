import {TypeBString} from "../types/type-bstring"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

export class BString extends Primitive {
  type: typeof TypeBString = TypeBString

  toJS(opts: JSOptions = {}) {
    return this.toString()
  }
}
