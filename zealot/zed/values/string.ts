import {TypeString} from "../types/type-string"
import {ZedValueInterface} from "./types"

export class String implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeString
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
