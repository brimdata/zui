/* eslint-disable @typescript-eslint/no-array-constructor */
import {isNull} from "lodash"
import {ZedContext} from "../context"
import {Array} from "../values/array"
import {ContainerTypeInterface, ZedType} from "./types"
import {typeId} from "../utils"
import * as zjson from "../../zjson"

export class TypeArray implements ContainerTypeInterface {
  kind = "array"
  type: ZedType

  constructor(type) {
    this.type = type
  }

  static stringify(type: ZedType) {
    return `[${typeId(type)}]`
  }

  create(values: zjson.ArrayValue, typedefs) {
    return new Array(
      this,
      isNull(values)
        ? null
        : values.map((value) => this.type.create(value, typedefs))
    )
  }

  serialize(typedefs: object) {
    return {
      kind: "array",
      type: this.type.serialize(typedefs)
    } as zjson.ArrayType
  }

  hasTypeType(ctx) {
    return ctx.hasTypeType(this.type)
  }

  walkTypeValues(ctx: ZedContext, value: zjson.ArrayValue, visit) {
    if (isNull(value)) return
    value.map((v) => ctx.walkTypeValues(this.type, v, visit))
  }
}
