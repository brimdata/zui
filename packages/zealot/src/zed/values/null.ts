import {TypeNull} from "../types/type-null"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

export class Null extends Primitive {
  type: typeof TypeNull = TypeNull
  value = null

  toJS(opts: JSOptions = {}) {
    return null
  }
}
