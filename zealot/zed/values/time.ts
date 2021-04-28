import {isNull} from "lodash"
import {TypeTime} from "../types/type-time"
import {Primitive} from "./primitive"

export class Time extends Primitive {
  type = TypeTime

  toDate() {
    if (isNull(this.value)) return null
    return new Date(+this.value * 1000)
  }
}
