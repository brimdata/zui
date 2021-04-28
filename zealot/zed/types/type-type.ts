import {isNull} from "lodash"
import {TypeValue} from "../values/type"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

export class TypeOfType implements PrimitiveTypeInterface<TypeValue> {
  name = "type"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string | null, typedefs) {
    if (isNull(value)) {
      return new TypeValue(null)
    } else {
      return new TypeValue(typedefs[value])
    }
  }

  hasTypeType() {
    return true
  }

  walkTypeValues(ctx, value, visit) {
    visit(value)
  }
}

export const TypeType = new TypeOfType()
