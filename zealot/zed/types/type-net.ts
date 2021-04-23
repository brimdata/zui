import {Net} from "../values/net"
import {PrimitiveTypeInterface} from "./types"

class TypeOfNet implements PrimitiveTypeInterface<Net> {
  name = "net"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value: string) {
    return new Net(value)
  }
}

export const TypeNet = new TypeOfNet()
