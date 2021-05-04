import {Uint64} from "../values/uint64"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfUint64 implements PrimitiveTypeInterface<Uint64> {
  name = "uint64"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value) {
    return new Uint64(value)
  }
}

export const TypeUint64 = new TypeOfUint64()
