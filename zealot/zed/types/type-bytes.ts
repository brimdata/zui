import {Bytes} from "../values/bytes"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfBytes implements PrimitiveTypeInterface<Bytes> {
  name = "bytes"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new Bytes(value)
  }
}

export const TypeBytes = new TypeOfBytes()
