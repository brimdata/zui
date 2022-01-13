import * as zjson from "../../zjson"
import {TypeDefs, ZedContext} from "../context"
import {isNull, typeId} from "../utils"
import {ZedMap} from "../values/map"
import {ContainerType, SerializeTypeDefs, Type} from "./types"

export class TypeMap implements ContainerType {
  kind = "union"
  id?: string | number

  constructor(public keyType: Type, public valType: Type) {}

  static stringify(keyType: Type, valType: Type) {
    return `|{` + typeId(keyType) + ":" + typeId(valType) + "}|"
  }

  create(value: [zjson.Value, zjson.Value][] | null, typedefs: TypeDefs) {
    return new ZedMap(
      this,
      isNull(value)
        ? null
        : new Map(
            value.map((entry) => [
              this.keyType.create(entry[0], typedefs),
              this.valType.create(entry[1], typedefs)
            ])
          )
    )
  }

  serialize(typedefs: SerializeTypeDefs): zjson.MapType {
    return {
      kind: "map",
      key_type: this.keyType.serialize(typedefs),
      val_type: this.valType.serialize(typedefs)
    }
  }

  hasTypeType(ctx: ZedContext) {
    return ctx.hasTypeType(this.keyType) || ctx.hasTypeType(this.valType)
  }

  walkTypeValues(
    ctx: ZedContext,
    value: zjson.Value,
    visit: (name: string) => void
  ) {
    if (isNull(value)) return
    const [key, val] = value
    ctx.walkTypeValues(this.keyType, key, visit)
    ctx.walkTypeValues(this.valType, val, visit)
  }

  toString() {
    return "|{" + this.keyType.toString() + ":" + this.valType.toString() + "}|"
  }
}
