import {isNull} from "../utils"
import {SetValue, Value} from "zealot/zjson"
import {ZedContext} from "../context"
import {typeId} from "../utils"
import {Set} from "../values/set"
import {ContainerTypeInterface, ZedType} from "./types"

export class TypeSet implements ContainerTypeInterface {
  kind = "set"
  type: ZedType

  constructor(type) {
    this.type = type
  }

  static stringify(type: ZedType) {
    return `|[${typeId(type)}]|`
  }

  create(values: SetValue, typedefs) {
    return new Set(
      this,
      isNull(values) ? null : values.map((v) => this.type.create(v, typedefs))
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

  toString() {
    return `|[` + this.type.toString() + `]|`
  }
}
