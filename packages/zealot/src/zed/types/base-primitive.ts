import * as zjson from "../../zjson"
import {Value} from "../values/types"
import {Type} from "./types"

export abstract class BasePrimitive<_T> implements Type {
  kind = "primitive"
  abstract name: string
  abstract create(value: zjson.Value, typedefs?: object): Value

  serialize(): zjson.PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  toString() {
    return this.name
  }
}
