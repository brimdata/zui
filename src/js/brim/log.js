/* @flow */
import type {Descriptor} from "../types"
import {inBounds} from "../lib/Array"
import brim from "./"

export default function(tuple: string[], descriptor: Descriptor) {
  return {
    tuple,
    descriptor,
    field(name: string) {
      let index = descriptor.findIndex((d) => d.name === name)
      if (inBounds(this.tuple, index)) {
        let {name, type} = descriptor[index]
        let value = tuple[index]
        return brim.field(name, type, value)
      } else {
        return null
      }
    }
  }
}
