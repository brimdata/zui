import {Union} from "../values/union"
import {ZedType} from "./types"
import {typeId} from "./utils"

export class TypeUnion {
  kind = "union"

  constructor(public types: ZedType[]) {}

  static stringify(types: ZedType[]) {
    return `(${types.map(typeId).join(",")})`
  }

  create([index, value], typedefs) {
    const innerType = this.types[index]
    return new Union(this, index, innerType.create(value, typedefs))
  }
}
