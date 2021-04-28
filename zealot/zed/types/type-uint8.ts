import {Uint8} from "../values/uint8"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfUint8 implements PrimitiveTypeInterface<Uint8> {
  name = "uint8"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value) {
    return new Uint8(value)
  }
}

export const TypeUint8 = new TypeOfUint8()
