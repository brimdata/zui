import {TypeBString} from "../types/type-bstring"
import {ZedValueInterface} from "./types"

export class BString implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeBString
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
