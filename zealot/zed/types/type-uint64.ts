import {UInt64} from "../values/uint64"
import {PrimitiveTypeInterface} from "./types"

class TypeOfUInt64 implements PrimitiveTypeInterface<UInt64> {
  name = "uint64"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value) {
    return new UInt64(value)
  }
}

export const TypeUInt64 = new TypeOfUInt64()
