import {ZedContext} from "../context"
import {isNull} from "../utils"
import {TypeValue} from "../values/type"
import {BasePrimitive} from "./base-primitive"
import {ZedType} from "./types"

export class TypeOfType extends BasePrimitive<TypeValue> {
  name = "type"

  create(value: string | null, typedefs: {[id: string]: ZedType}) {
    if (isNull(value)) {
      return new TypeValue(null)
    } else {
      return new TypeValue(typedefs[value])
    }
  }

  hasTypeType() {
    return true
  }

  walkTypeValues(
    ctx: ZedContext,
    value: TypeValue,
    visit: (v: TypeValue) => void
  ) {
    visit(value)
  }
}

export const TypeType = new TypeOfType()
