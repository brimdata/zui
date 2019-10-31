/* @flow */
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
    }
  }
}

export default compoundField
