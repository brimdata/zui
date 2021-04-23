import {Float64} from "../values/float64"
import {PrimitiveTypeInterface} from "./types"

class TypeOfFloat64 implements PrimitiveTypeInterface<Float64> {
  name = "float64"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value) {
    return new Float64(value)
  }
}

export const TypeFloat64 = new TypeOfFloat64()
