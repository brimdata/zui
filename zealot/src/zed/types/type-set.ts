import * as zjson from "../../zjson"
import {SetValue, Value} from "../../zjson"
import {TypeDefs, ZedContext} from "../context"
import {isNull, typeId} from "../utils"
import {Set} from "../values/set"
import {ContainerType, SerializeTypeDefs, Type} from "./types"

export class TypeSet implements ContainerType {
  id?: string | number
  kind = "set"
  type: Type

  constructor(type: Type) {
    this.type = type
  }

  static stringify(type: Type) {
    return `|[${typeId(type)}]|`
  }

  create(values: SetValue, typedefs: TypeDefs) {
    return new Set(
      this,
      isNull(values) ? null : values.map((v) => this.type.create(v, typedefs))
    )
  }

  serialize(typedefs: SerializeTypeDefs): zjson.SetType {
    return {
      kind: "set",
      type: this.type.serialize(typedefs)
    }
  }

  hasTypeType(ctx: ZedContext) {
    return ctx.hasTypeType(this.type)
  }

  walkTypeValues(
    ctx: ZedContext,
    value: Value[] | null,
    visit: (name: string) => void
  ) {
    if (isNull(value)) return
    value.forEach((v) => ctx.walkTypeValues(this.type, v, visit))
  }

  toString() {
    return `|[` + this.type.toString() + `]|`
  }
}
