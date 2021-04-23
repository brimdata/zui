import {TypeNull} from "../types/type-null"
import {ZedValueInterface} from "./types"

export class Null implements ZedValueInterface {
  constructor() {}

  get type() {
    return TypeNull
  }

  toString() {
    return ""
  }

  serialize() {
    return null
  }
}
