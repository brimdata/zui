import {zed} from "zealot"

export const ONE_CHAR = 7.39
export const FIELD_PAD = 14
export const PATH_PAD = 12

interface PrimitiveField {
  name: string
  data: zed.Primitive
}

export function createPrimitiveCell({name, data}: PrimitiveField) {
  const type = data.type
  const value = data.value

  return {
    name,
    type,
    value,
    serialize() {
      return {name, type, value}
    },
    stringValue(): string {
      if (value === null) return "null"
      else if (Array.isArray(value)) return value.join(",")
      else return value
    },

    toDate() {
      return new Date(+this.value * 1000)
    },
    compound() {
      return false
    },
    guessWidth() {
      if (name === "_path") {
        return this.display().length * ONE_CHAR + FIELD_PAD + PATH_PAD
      } else {
        return Math.ceil(this.display().length * ONE_CHAR + FIELD_PAD)
      }
    }
  }
}
