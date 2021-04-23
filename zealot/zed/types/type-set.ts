import {ZedType} from "./types"
import {typeId} from "./utils"
import {Set} from "../values/set"

export class TypeSet {
  kind = "set"
  type: ZedType

  constructor(type) {
    this.type = type
  }

  static stringify(type: ZedType) {
    return `|[${typeId(type)}]|`
  }

  create(values, typedefs) {
    return new Set(
      this,
      values.map((v) => this.type.create(v, typedefs))
    )
  }
}
