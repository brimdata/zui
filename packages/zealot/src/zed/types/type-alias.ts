import * as zjson from "../../zjson"
import {TypeDefs, ZedContext} from "../context"
import {Field} from "../values/field"
import {TypeRecord} from "./type-record"
import {Value} from "../values/types"
import {ContainerType, SerializeTypeDefs, Type} from "./types"

export class TypeAlias implements ContainerType {
  kind = "alias"
  name: string
  type: Type
  id?: string | number

  constructor(name: string, type: Type) {
    this.name = name
    this.type = type
  }

  static stringify(name: string, type: Type) {
    return name + "=(" + type.toString() + ")"
  }

  create(value: zjson.Value, typedefs: TypeDefs, parent?: Field) {
    let v: Value
    if (this.type instanceof TypeRecord || this.type instanceof TypeAlias) {
      v = this.type.create(value, typedefs, parent)
    } else {
      v = this.type.create(value, typedefs)
    }
    v.type = this // a better way to do this?
    return v
  }

  serialize(typedefs: SerializeTypeDefs): zjson.Type {
    if (this.name in typedefs) {
      return {kind: "typename", name: this.name}
    } else {
      const type = this.type.serialize(typedefs)
      typedefs[this.name] = type
      return {kind: "typedef", name: this.name, type}
    }
  }

  hasTypeType() {
    return true
  }

  walkTypeValues(
    ctx: ZedContext,
    value: zjson.Value,
    visit: (name: string) => void
  ) {
    ctx.walkTypeValues(this.type, value, visit)
  }

  toString() {
    return this.name + "=(" + this.type.toString() + ")"
  }
}
