import {uniqBy} from "lodash"
import {zed} from "zealot"
import {$Column, createColumn} from "./column"

type Args = {[name: string]: zed.Schema}

export function createColumnSet(c: Args) {
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
      for (const schema of Object.values(c)) {
        let inner = schema.flatten().type
        if (inner.kind === "record") {
          allCols = [...allCols, ...inner.fields]
        }
      }
      return uniqBy<$Column>(allCols.map(createColumn), "key")
    }
  }
}
