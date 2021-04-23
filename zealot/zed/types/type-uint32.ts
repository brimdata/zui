import {UInt32} from "../values/uint32"
import {PrimitiveTypeInterface} from "./types"

class TypeOfUInt32 implements PrimitiveTypeInterface<UInt32> {
  name = "uint32"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value) {
    return new UInt32(value)
  }
}

export const TypeUInt32 = new TypeOfUInt32()
