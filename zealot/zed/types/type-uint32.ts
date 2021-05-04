import {Uint32} from "../values/uint32"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfUint32 implements PrimitiveTypeInterface<Uint32> {
  name = "uint32"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value) {
    return new Uint32(value)
  }
}

export const TypeUint32 = new TypeOfUint32()
