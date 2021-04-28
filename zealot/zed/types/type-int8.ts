import {Int8} from "../values/int8"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfInt8 implements PrimitiveTypeInterface<Int8> {
  name = "int8"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value) {
    return new Int8(value)
  }
}

export const TypeInt8 = new TypeOfInt8()
