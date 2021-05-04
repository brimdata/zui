import {Int64} from "../values/int64"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfInt64 implements PrimitiveTypeInterface<Int64> {
  name = "int64"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value) {
    return new Int64(value)
  }
}

export const TypeInt64 = new TypeOfInt64()
