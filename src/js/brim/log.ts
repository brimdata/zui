import {Descriptor} from "../types"
import {inBounds} from "../lib/Array"
import brim, {$Field} from "./"

export default function(tuple: string[], descriptor: Descriptor) {
  return {
    tuple,
    descriptor,
    field(name: string): null | $Field {
      const index = descriptor.findIndex((d) => d.name === name)
      if (inBounds(this.tuple, index)) {
        const {name, type} = descriptor[index]
        const value = tuple[index]
        return brim.field({name, type, value})
      } else {
        return null
      }
    }
  }
}
