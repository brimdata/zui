import {Int32} from "../values/int32"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfInt32 implements PrimitiveTypeInterface<Int32> {
  name = "int32"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value) {
    return new Int32(value)
  }
}

export const TypeInt32 = new TypeOfInt32()
