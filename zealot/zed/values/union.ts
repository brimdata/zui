import {TypeUnion} from "../types/type-union"
import {ZedValue, ZedValueInterface} from "./types"

export class Union implements ZedValueInterface {
  constructor(
    public type: TypeUnion,
    public position: number,
    public value: ZedValue
  ) {}

  toString() {
    return "TO DO"
  }

  serialize() {
    return "TO DO"
  }
}
