import {Net} from "../values/net"
import {BasePrimitive} from "./base-primitive"

class TypeOfNet extends BasePrimitive<Net> {
  name = "net"

  create(value: string) {
    return new Net(value)
  }
}

export const TypeNet = new TypeOfNet()
