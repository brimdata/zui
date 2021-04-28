import {Net} from "../values/net"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfNet implements PrimitiveTypeInterface<Net> {
  name = "net"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new Net(value)
  }
}

export const TypeNet = new TypeOfNet()
