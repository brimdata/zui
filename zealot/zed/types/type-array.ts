import {ZedType} from "./types"
import {typeId} from "./utils"
import {ZedArray} from "../values/array"

export class TypeArray {
  kind = "array"
  type: ZedType

  constructor(type) {
    this.type = type
  }

  static stringify(type: ZedType) {
    return `[${typeId(type)}]`
  }

  create(values, typedefs) {
    return new ZedArray(
      this,
      values.map((value) => this.type.create(value, typedefs))
    )
  }
}
