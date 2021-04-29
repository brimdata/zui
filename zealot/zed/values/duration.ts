import {isNull} from "lodash"
import {TypeDuration} from "../types/type-duration"
import {Primitive} from "./primitive"

export class Duration extends Primitive {
  type = TypeDuration

  asSeconds() {
    if (isNull(this.value)) return null
    return parseFloat(this.value)
  }
}
