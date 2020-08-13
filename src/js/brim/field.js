/* @flow */

import {isEqual} from "lodash"

import {COMPOUND_FIELD_RGX} from "./compoundField"
import type {FieldData} from "../types/records"
import {isArray} from "../lib/is"
import {withCommas} from "../lib/fmt"
import brim, {type $Field} from "./"

export const ONE_CHAR = 7.39
export const FIELD_PAD = 14
export const PATH_PAD = 12
const WHITE_SPACE = /\s+/
const COMMA = /,/
const STRING_TYPE = /^b?string$/
const DOUBLE_QUOTE = /"/g
const ESCAPED_DOUBLE_QUOTE = '\\"'
const BACK_SLASH = /\\/
const ESCAPED_BACK_SLASH = "\\\\"

function field({name, type, value}: FieldData): $Field {
  return {
    name,
    type,
    value,
    queryableValue() {
      if (this.compound()) {
        return this.toCompound()
          .items()
          .map(field)
          .map((f) => f.queryableValue())
          .join(" ")
      }
      if (this.value === null) return "null"
      if (this.type === "bool") return this.value === "T" ? "true" : "false"
      let quote = [WHITE_SPACE, COMMA].some((reg) => reg.test(this.value))
      if (STRING_TYPE.test(this.type)) quote = true
      const str = this.value
        .replace(BACK_SLASH, ESCAPED_BACK_SLASH)
        .replace(DOUBLE_QUOTE, ESCAPED_DOUBLE_QUOTE)
      return quote ? `"${str}"` : str
    },
    stringValue(): string {
      if (value === null) return "null"
      else if (isArray(value)) return value.join(",")
      else return value
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
        return withCommas(value.toString())
      } else if (type === "time") {
        return brim.time(this.toDate()).format()
      } else if (isEqual(value, {})) {
        return ""
      } else {
        return value.toString()
      }
    },
    guessWidth() {
      if (name === "_path") {
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
