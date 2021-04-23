import {TypeTime} from "../types/type-time"
import {ZedValueInterface} from "./types"

export class Time implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeTime
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
