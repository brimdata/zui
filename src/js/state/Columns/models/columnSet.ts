import {uniqBy} from "lodash"
import {TypeContext} from "zealot/zed/zjson"
import {$Column, createColumn} from "./column"

export function createColumnSet(c: TypeContext) {
  return {
    getName() {
      if (c.size === 0) {
        return "none"
      } else if (c.size === 1) {
        return Array.from(c.keys())[0]
      } else {
        return "temp"
      }
    },
    getUniqColumns() {
      let allCols = []
      for (const typedef of c.values()) {
        let inner = typedef.flatten().innerType
        if (inner.kind === "record") {
          allCols = [...allCols, ...inner.fields]
        }
      }
      return uniqBy<$Column>(allCols.map(createColumn), "key")
    }
  }
}
