import {TypeFloat64} from "../types/type-float64"
import {ZedValueInterface} from "./types"

export class Float64 implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeFloat64
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
