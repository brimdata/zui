/* @flow */

import {isEqual} from "lodash"

import {COMPOUND_FIELD_RGX} from "./compoundField"
import type {FieldData} from "../types/records"
import {withCommas} from "../lib/fmt"
import brim, {type $Field} from "./"

export const ONE_CHAR = 7.39
export const FIELD_PAD = 14
export const PATH_PAD = 12

function field({name, type, value}: FieldData): $Field {
  return {
    name,
    type,
    value,
    queryableValue() {
      if (this.value === null) return "null"
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
      // $FlowFixMe
      return brim.compoundField(name, type, value)
    },
    toDate() {
      return new Date(+this.value * 1000)
    },
    display() {
      if (value === "(empty)") {
        return ""
      } else if (value === null) {
        return "⦻"
      } else if (type === "count") {
        return withCommas(value)
      } else if (isEqual(value, {})) {
        return ""
      } else {
        return value
      }
    },
    guessWidth() {
      if (type === "time") {
        return 192
      } else if (name === "_path") {
        return this.display().length * ONE_CHAR + FIELD_PAD + PATH_PAD
      } else if (this.compound()) {
        return this.toCompound().guessWidth()
      } else {
        return Math.ceil(this.display().length * ONE_CHAR + FIELD_PAD)
      }
    }
  }
}

export default field
