import {ZedContext} from "../context"
import {Value} from "../../zjson"
import {ContainerTypeInterface, ZedType} from "./types"

export class TypeAlias implements ContainerTypeInterface {
  kind = "alias"
  name: string
  type: ZedType

  constructor(name: string, type: ZedType) {
    this.name = name
    this.type = type
  }

  static stringify(name, type) {
    return name + "=(" + type.toString() + ")"
  }

  create(value: Value, typedefs: object) {
    const v = this.type.create(value, typedefs)
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
}
