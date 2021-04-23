import {UInt16} from "../values/uint16"
import {PrimitiveTypeInterface} from "./types"

class TypeOfUInt16 implements PrimitiveTypeInterface<UInt16> {
  name = "uint16"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value) {
    return new UInt16(value)
  }
}

export const TypeUInt16 = new TypeOfUInt16()
