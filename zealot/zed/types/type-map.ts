import {ZedType} from "./types"
import {typeId} from "./utils"
import {ZedMap} from "../values/map"
export class TypeMap {
  kind = "union"

  constructor(public keyType: ZedType, public valType: ZedType) {}

  static stringify(keyType, valType) {
    return `|{` + typeId(keyType) + "," + typeId(valType) + "}|"
  }

  create(value, typedefs) {
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
}
