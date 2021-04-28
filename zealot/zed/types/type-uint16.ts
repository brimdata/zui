import {Uint16} from "../values/uint16"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfUint16 implements PrimitiveTypeInterface<Uint16> {
  name = "uint16"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value) {
    return new Uint16(value)
  }

  stringify() {
    return this.name
  }
}

export const TypeUint16 = new TypeOfUint16()
