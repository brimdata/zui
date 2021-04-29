import {isNull} from "../utils"
import {Value} from "zealot/zjson"
import {ZedContext} from "../context"
import {ZedMap} from "../values/map"
import {ContainerTypeInterface, ZedType} from "./types"
import {typeId} from "../utils"
export class TypeMap implements ContainerTypeInterface {
  kind = "union"

  constructor(public keyType: ZedType, public valType: ZedType) {}

  static stringify(keyType, valType) {
    return `|{` + typeId(keyType) + "," + typeId(valType) + "}|"
  }

  create(value: [Value, Value][], typedefs) {
    return new ZedMap(
      this,
      new Map(
        value.map((entry) => [
          this.keyType.create(entry[0], typedefs),
          this.valType.create(entry[1], typedefs)
        ])
      )
    )
  }

  serialize(typedefs: object) {
    return {
      kind: "map",
      key_type: this.keyType.serialize(typedefs),
      val_type: this.valType.serialize(typedefs)
    }
  }

  hasTypeType(ctx: ZedContext) {
    return ctx.hasTypeType(this.keyType) || ctx.hasTypeType(this.valType)
  }

  walkTypeValues(ctx: ZedContext, value, visit) {
    if (isNull(value)) return
    const [key, val] = value
    ctx.walkTypeValues(this.keyType, key, visit)
    ctx.walkTypeValues(this.valType, val, visit)
  }
}
