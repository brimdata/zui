import {SerializeTypeDefs} from ".."
import {zjson} from "../.."
import {TypeDefs, ZedContext} from "../context"
import {Type, ContainerType} from "./types"
import {Error} from "../values/error"
import {isNull} from "lodash"
import {typeId} from "../utils/type-id"
export class TypeError implements ContainerType {
  kind = "error"
  id?: number | string

  constructor(public type: Type) {}

  static stringify(type: Type) {
    return `error<${typeId(type)}>`
  }

  create(value: zjson.Value, typedefs: TypeDefs) {
    if (value === null) {
      return new Error(this, null)
    } else {
      return new Error(this, this.type.create(value, typedefs))
    }
  }

  serialize(typedefs: SerializeTypeDefs): zjson.ErrorType {
    return {
      kind: "error",
      type: this.type.serialize(typedefs)
    }
  }

  hasTypeType(ctx: ZedContext) {
    return ctx.hasTypeType(this.type)
  }

  walkTypeValues(
    context: ZedContext,
    value: zjson.Value,
    visit: (name: string) => void
  ): void {
    if (isNull(value)) return
    context.walkTypeValues(this.type, value, visit)
  }
}
