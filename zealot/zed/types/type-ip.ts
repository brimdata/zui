import {Ip} from "../values/ip"
import {PrimitiveTypeInterface} from "./types"

class TypeOfIp implements PrimitiveTypeInterface<Ip> {
  name = "ip"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value: string) {
    return new Ip(value)
  }
}

export const TypeIp = new TypeOfIp()
