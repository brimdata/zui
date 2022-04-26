import {uniqBy} from "lodash"
import {toFieldPath} from "src/js/zql/toZql"
import {TypeDefs, zed} from "@brimdata/zealot"
import {$Column, createColumn} from "./column"

export function createColumnSet(shapeMap: TypeDefs) {
  const byColumNames = fingerPrintSchemas(shapeMap)

  return {
    getName() {
      const keys = Object.keys(byColumNames)
      if (keys.length === 0) {
        return "none"
      } else if (keys.length === 1) {
        return keys[0]
      } else {
        return "temp"
      }
    },
    getUniqColumns() {
      let allCols = []
      for (const shape of Object.values(byColumNames)) {
        allCols = [...allCols, ...zed.flatColumns(shape)]
      }
      return uniqBy<$Column>(allCols.map(createColumn), "key")
    },
  }
}

function fingerPrintSchemas(map: TypeDefs): TypeDefs {
  return Object.values(map).reduce((obj, value) => {
    obj[fingerprint(value)] = value
    return obj
  }, {})
}

function fingerprint(shape: zed.Type) {
  return zed
    .flatColumns(shape)
    .map(toFieldPath)
    .sort() // We want the shapes with the same columns regardless of order
    .join(",")
}
