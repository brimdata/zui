import {isNull} from "../utils"
import {TypeTime} from "../types/type-time"
import {Primitive} from "./primitive"

export class Time extends Primitive {
  type = TypeTime

  toDate() {
    if (isNull(this.value)) return null
    // Need to parse dates special now...
    let d
    if (this.value.match(/[\d.]*/)) {
      // Epoch Seconds
      d = new Date(+this.value * 1000)
    } else {
      // ISO Date String
      d = new Date(Date.parse(this.value))
    }
    if (isNaN(d)) {
      throw new Error(`Unkown Time Value: ${this.value}`)
    }
  }
}
