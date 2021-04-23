import {TypeTypename} from "../types/type-typename"
import {ZedValueInterface} from "./types"

export class Typename implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeTypename
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
