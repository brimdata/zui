import {isNull} from "../utils"
import {TypeDuration} from "../types/type-duration"
import {Primitive} from "./primitive"

export class Duration extends Primitive {
  type = TypeDuration

  parse() {
    let unit = this.value!.replace(/[\d.]*/, "")
    if (unit.trim().length === 0) unit = "s"
    const number = parseFloat(this.value!.replace(unit, ""))
    return {unit, number}
  }

  asSeconds() {
    if (isNull(this.value)) return null
    const {unit, number} = this.parse()
    if (unit === "ms") return number / 1000
    if (unit === "s") return number
    throw new Error("Implement duration unit: " + unit)
  }
}
