/* @flow */

import {COMPOUND_FIELD_RGX} from "./compoundField"
import brim, {type $Field} from "./"

function field(name: string, type: string, value: string): $Field {
  return {
    name,
    type,
    value,
    queryableValue() {
      let WHITE_SPACE = /\s+/
      let COMMA = /,/
      let quote = [WHITE_SPACE, COMMA].some((reg) => reg.test(this.value))
      if (this.type === "string") quote = true

      return quote ? `"${this.value}"` : this.value
    },
    compound() {
      return COMPOUND_FIELD_RGX.test(type)
    },
    toCompound() {
      return brim.compoundField(name, type, value)
    },
    toDate() {
      return new Date(+this.value * 1000)
    }
  }
}

export default field
