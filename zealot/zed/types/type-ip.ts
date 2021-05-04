import {Ip} from "../values/ip"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfIp implements PrimitiveTypeInterface<Ip> {
  name = "ip"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new Ip(value)
  }
}

export const TypeIp = new TypeOfIp()
