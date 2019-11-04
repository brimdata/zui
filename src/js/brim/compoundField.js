/* @flow */
import {ONE_CHAR} from "./field"
import brim, {type $CompoundField} from "./"

export const COMPOUND_FIELD_RGX = /^(set|vector)\[(\w+)\]$/
type $T = $CompoundField

function compoundField(name: string, type: string, value: string): $T {
  let match = type.match(COMPOUND_FIELD_RGX)
  if (!match) throw new Error("Not compound type: " + type)
  let [_, container, itemType] = match
  let items = value.split(",")

  return {
    name,
    container,
    itemType,
    length: items.length,
    items() {
      return items.map((_, index) => this.item(index))
    },
    item(index: number) {
      if (items[index]) {
        return brim.field(name, itemType, items[index])
      } else {
        return null
      }
    },
    guessWidth() {
      const comma = ONE_CHAR
      const wrap = 2 * ONE_CHAR
      let items = this.items()
      let sum = 0
      for (let item of items) {
        sum += item.guessWidth()
      }
      sum += comma * (items.length - 1)
      sum += wrap
      return sum
    }
  }
}

export default compoundField
