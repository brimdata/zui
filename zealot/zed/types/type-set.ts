import {isNull} from "lodash"
import {Value} from "zealot/zjson"
import {ZedContext} from "../context"
import {Set} from "../values/set"
import {ContainerTypeInterface, ZedType} from "./types"
import {typeId} from "../utils"

export class TypeSet implements ContainerTypeInterface {
  kind = "set"
  type: ZedType

  constructor(type) {
    this.type = type
  }

  static stringify(type: ZedType) {
    return `|[${typeId(type)}]|`
  }

  create(values, typedefs) {
    return new Set(
      this,
      values.map((v) => this.type.create(v, typedefs))
    )
  }

  serialize(typedefs: object) {
    return {
      kind: "set",
      type: this.type.serialize(typedefs)
    }
  }

  hasTypeType(ctx: ZedContext) {
    return ctx.hasTypeType(this.type)
  }

  walkTypeValues(ctx: ZedContext, value: Value[] | null, visit) {
    if (isNull(value)) return
    value.forEach((v) => ctx.walkTypeValues(this.type, v, visit))
  }
}
