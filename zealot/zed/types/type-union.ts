import {Value} from "zealot/zjson"
import {ZedContext} from "../context"
import {isNull, typeId} from "../utils"
import {Union} from "../values/union"
import {TypeNull} from "./type-null"
import {ContainerTypeInterface, ZedType} from "./types"

type UnionValue = [string, Value] | null
export class TypeUnion implements ContainerTypeInterface {
  kind = "union"

  constructor(public types: ZedType[]) {}

  static stringify(types: ZedType[]) {
    return `(${types.map(typeId).join(",")})`
  }

  // @ts-ignore
  create(value: UnionValue, typedefs: object): Union {
    if (value === null) {
      return new Union(this, TypeNull, null, null)
    } else {
      const index = parseInt(value[0])
      const innerType = this.types[index]
      const innerValue = innerType.create(value[1], typedefs)
      return new Union(this, innerType, index, innerValue)
    }
  }

  // @ts-ignore
  serialize(typedefs: object) {
    return {
      kind: "union",
      types: this.types.map((t) => t.serialize(typedefs))
    }
  }

  hasTypeType(ctx: ZedContext) {
    return this.types.some((t) => ctx.hasTypeType(t))
  }

  walkTypeValues(
    ctx: ZedContext,
    value: UnionValue,
    visit: (name: string) => void
  ) {
    if (isNull(value)) return

    const index = parseInt(value[0])
    const innerType = this.types[index]
    const innerValue = value[1]

    if (value === null) ctx.walkTypeValues(innerType, innerValue, visit)
  }

  // @ts-ignore
  toString() {
    return `(${this.types.map((t) => t.toString()).join(",")})`
  }
}
