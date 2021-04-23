import {Int64} from "../values/int64"
import {PrimitiveTypeInterface} from "./types"

class TypeOfInt64 implements PrimitiveTypeInterface<Int64> {
  name = "int64"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value) {
    return new Int64(value)
  }
}

export const TypeInt64 = new TypeOfInt64()
