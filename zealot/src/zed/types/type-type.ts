import * as zjson from "../../zjson"
import {TypeDefs, ZedContext} from "../context"
import {getPrimitiveType, isNull, isPrimitiveName} from "../utils"
import {TypeValue} from "../values/type"
import {Value} from "../values/types"
import {BasePrimitive} from "./base-primitive"

export class TypeOfType extends BasePrimitive<TypeValue> {
  name = "type"

  create(value: string | null, typedefs: TypeDefs): Value {
    if (isNull(value)) {
      return new TypeValue(null)
    } else {
      if (isPrimitiveName(value)) {
        return new TypeValue(getPrimitiveType(value))
      } else {
        return new TypeValue(typedefs[value])
      }
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
    if (typeof value === "string") visit(value)
  }
}

export const TypeType = new TypeOfType()
