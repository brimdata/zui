import {uniqBy} from "lodash"
import {zed} from "zealot"
import {$Column, createColumn} from "./column"

type Args = {[name: string]: zed.Schema}

export function createColumnSet(schemaMap: Args) {
  const byColumNames = fingerPrintSchemas(schemaMap)

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
      for (const schema of Object.values(byColumNames)) {
        let inner = schema.type
        if (inner.kind === "record") {
          allCols = [...allCols, ...schema.flatColumns()]
        }
      }
      return uniqBy<$Column>(allCols.map(createColumn), "key")
    }
  }
}

function fingerPrintSchemas(map: Args): Args {
  return Object.values(map).reduce((obj, value) => {
    obj[fingerprint(value)] = value
    return obj
  }, {})
}

function fingerprint(schema: zed.Schema) {
  return schema
    .flatten()
    .type.fields.map((f) => f.name)
    .sort()
    .join("")
}
