import {PrimitiveType, Value} from "zealot/zjson"

export abstract class BasePrimitive<T> {
  kind = "primitive"
  abstract name: string
  abstract create(value: Value, typedefs?: object): T

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  toString() {
    return this.name
  }
}
