import {TypeDuration} from "../types/type-duration"
import {ZedValueInterface} from "./types"

export class Duration implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeDuration
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
