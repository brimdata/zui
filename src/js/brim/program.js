/* @flow */

import type {$Field, $Log} from "./"
import {getGroupByProc, parse, splitParts} from "../lib/Program"
import {onlyWhitespace, trim} from "../lib/Str"

export default function(string: string = "") {
  return {
    exclude(field: $Field) {
      let index = string.indexOf("|")
      let part = field.name + "!=" + field.queryableValue()

      if (index < 0) {
        string = string + " " + part
      } else {
        string =
          string.substring(0, index) +
          part +
          " " +
          string.substring(index, string.length)
      }

      return this
    },
    include(field: $Field) {
      let index = string.indexOf("|")
      let part = field.name + "=" + field.queryableValue()

      if (index < 0) {
        string = string + " " + part
      } else {
        string =
          string.substring(0, index) +
          part +
          " " +
          string.substring(index, string.length)
      }

      return this
    },
    drillDown(log: $Log) {
      const [ast] = parse(string)
      const groupByProc = getGroupByProc(ast)

      if (!groupByProc) {
        throw new Error(`Missing GroupByProc in '${string}'`)
      }

      function getKeyFromLog(key) {
        let field = log.field(key)
        if (field) return `${key}=${field.queryableValue()}`
        else return ""
      }

      const filters = groupByProc.keys.map(getKeyFromLog)
      let [filter] = splitParts(string)

      if (/\s*\*\s*/.test(filter)) filter = ""
      if (filters.includes(filter)) filter = ""

      string = trim([filter, ...filters].map(trim).join(" "))
      return this
    },

    countBy(field: $Field) {
      let current = onlyWhitespace(string) ? "*" : string
      string = trim(current + ` | count() by ${field.name}`)
      return this
    },

    toString() {
      return string
    }
  }
}
