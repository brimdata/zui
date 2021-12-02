import {Field, TypeRecord} from ".."
import {Value} from "../../zjson"
import {ZedContext} from "../context"
import {ContainerTypeInterface, ZedType} from "./types"

export class TypeAlias implements ContainerTypeInterface {
  kind = "alias"
  name: string
  type: ZedType
  id: string | number

  constructor(name: string, type: ZedType) {
    this.name = name
    this.type = type
  }

  static stringify(name, type) {
    return name + "=(" + type.toString() + ")"
  }

  create(value: Value, typedefs: object, parent?: Field) {
    let v
    if (this.type instanceof TypeRecord || this.type instanceof TypeAlias) {
      v = this.type.create(value, typedefs, parent)
    } else {
      v = this.type.create(value, typedefs)
    }
    v.type = this // a better way to do this?
    return v
  }

  serialize(typedefs) {
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

  walkTypeValues(ctx: ZedContext, value: Value, visit) {
    ctx.walkTypeValues(this.type, value, visit)
  }

  toString() {
    return this.name + "=(" + this.type.toString() + ")"
  }
}
