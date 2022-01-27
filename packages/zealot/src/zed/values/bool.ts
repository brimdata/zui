import {isNull} from "lodash"
import {TypeBool} from "../types/type-bool"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

export class Bool extends Primitive {
  type: typeof TypeBool = TypeBool

  toJS() {
    if (isNull(this.value)) return null
    if (this.value === "true") return true
    return false
  }
}
