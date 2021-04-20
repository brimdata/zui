import {uniqBy} from "lodash"
import {TypeContext} from "zealot/zed/zjson"
import {$Column, createColumn} from "./column"

export function createColumnSet(c: TypeContext) {
  return {
    getName() {
      const keys = Object.keys(c)
      const size = keys.length
      if (size === 0) {
        return "none"
      } else if (size === 1) {
        return keys[0]
      } else {
        return "temp"
      }
    },
    getUniqColumns() {
      let allCols = []
      for (const typedef of Object.values(c)) {
        let inner = typedef.flatten().innerType
        if (inner.kind === "record") {
          allCols = [...allCols, ...inner.fields]
        }
      }
      return uniqBy<$Column>(allCols.map(createColumn), "key")
    }
  }
}
