import {Context} from "../index"
import * as zjson from "../../zjson"
import {TypeDefs} from "../context"
import {isNull} from "../utils/is-null"
import {Union} from "../values/union"
import {TypeNull} from "./type-null"
import {ContainerType, SerializeTypeDefs, Type} from "./types"
import {typeId} from "../utils/type-id"

type UnionValue = [string, zjson.Value] | null
export class TypeUnion implements ContainerType {
  kind = "union"
  id?: number | string

  constructor(public types: Type[]) {}

  static stringify(types: Type[]) {
    return `(${types.map(typeId).join(",")})`
  }

  create(value: zjson.UnionValue, typedefs: TypeDefs) {
    if (value === null) {
      return new Union(this, TypeNull, null, null)
    } else {
      const index = parseInt(value[0])
      const innerType = this.types[index]
      const innerValue = innerType.create(value[1], typedefs)
      return new Union(this, innerType, index, innerValue)
    }
  }

  serialize(typedefs: SerializeTypeDefs): zjson.UnionType {
    return {
      kind: "union",
      types: this.types.map((t) => t.serialize(typedefs))
    }
  }

  hasTypeType(ctx: Context) {
    return this.types.some((t) => ctx.hasTypeType(t))
  }

  walkTypeValues(
    ctx: Context,
    value: UnionValue,
    visit: (name: string) => void
  ) {
    if (isNull(value)) return

    const index = parseInt(value[0])
    const innerType = this.types[index] as Type
    const innerValue = value[1]

    if (value === null) ctx.walkTypeValues(innerType, innerValue, visit)
  }

  toString() {
    return `(${this.types.map((t) => t.toString()).join(",")})`
  }
}
