import {Record} from "../values/record"
import {Array} from "../values/array"
import {ZedMap} from "../values/map"
import {Set} from "../values/set"
import {Union} from "../values/union"
import {Error} from "../values/error"

const containers = [Record, Array, Set, Union, ZedMap, Error]

export function isContainer(value: unknown) {
  for (let name of containers) {
    if (value instanceof name) return true
  }
  return false
}
