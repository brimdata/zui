import {isNull} from "../utils"
import {Value} from "zealot/zjson"
import {Union} from "../values/union"
import {TypeNull} from "./type-null"
import {ContainerTypeInterface, ZedType} from "./types"
import {typeId} from "../utils"

type UnionValue = [string, Value] | null
export class TypeUnion implements ContainerTypeInterface {
  kind = "union"

  constructor(public types: ZedType[]) {}

  static stringify(types: ZedType[]) {
    return `(${types.map(typeId).join(",")})`
  }

  create(value: UnionValue, typedefs) {
    if (value === null) {
      return new Union(this, TypeNull, null, null)
    } else {
      const index = parseInt(value[0])
      const innerType = this.types[index]
      const innerValue = innerType.create(value[1], typedefs)
      return new Union(this, innerType, index, innerValue)
    }
  }

  serialize(typedefs: object) {
    return {
      kind: "union",
      types: this.types.map((t) => t.serialize(typedefs))
    }
  }

  hasTypeType(ctx) {
    return this.types.some((t) => ctx.hasTypeType(t))
  }

  walkTypeValues(ctx, value: UnionValue, visit) {
    if (isNull(value)) return

    const index = parseInt(value[0])
    const innerType = this.types[index]
    const innerValue = value[1]

    if (value === null) ctx.walkTypeValue(innerType, innerValue, visit)
  }

  toString() {
    return `(${this.types.map((t) => t.toString()).join(",")})`
  }
}
